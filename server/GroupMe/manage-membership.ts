import { Employee } from '../../src/app/services/employee.model';
import { getGroup, recordGroupMeMembership, RemoveMemberRecord, addMembers, removeMembers, formatPhoneNumber, padToLength } from './ops';
import { Member, AddMemberData } from './GroupMe.d';
import { loadParty, markNotGroupMeConnected } from '../operations';
import { smsImageUrl } from './constants';
import { HotSchedulesParty } from '../../src/app/services/employee-parties.model';

export async function manageMembership(employees: {[employeeId: string]: Employee}, getConfig, options?: Options): Promise<void> {
  if(!options) options = {};
  const editMembership = !options.listManagements && !options.linkProfiles;

  var matchedEmployees = 0,
      matchedMembers = 0,
      foundProfileImages = 0,
      savedProfileImages = 0;

  const groupId: string = getConfig('GroupMe.mainGroupId', "");
  const apiToken: string = getConfig('GroupMe.apiToken', "");

  if(!groupId)  return Promise.reject('[manage-membership.ts]: cannot login without groupId');
  if(!apiToken)  return Promise.reject('[manage-membership.ts]: cannot login without apiToken');

  let preload = [];
  preload.push(getGroup(groupId, apiToken));

  for(let employeeId in employees)
    preload.push(loadParty(employees[employeeId], 'GroupMe'))

  const [group, ..._otherCallResults] = await Promise.all(preload);
  const members: Member[] = group.members;
  let toBeAdded: Employee[] = [];
  let toBeRemoved: RemoveMemberRecord[] = [];

  if(!options.quiet)
    console.log(`Comparing ${Object.keys(employees).length} employees in HotSchedules to ${members.length} members in ${group.name}`);

  let networkRequests = [];

  for(let member of members){
    let shouldBeRemoved = true;
    let matchedEmployee: Employee;

    if(member.roles.indexOf('owner') > -1)
      shouldBeRemoved = false;
    else
      for(let employeeId in employees){
        const employee = employees[employeeId];
        if(employeeIsMember(employee, member)){
          matchedMembers++;
          matchedEmployee = employee;

          if(employee.roles.teamMember || employee.roles.serviceAccount)
            shouldBeRemoved = false;

          break;
        }
      }

    if(shouldBeRemoved)
      toBeRemoved.push({
        member,
        employee: matchedEmployee
      });
  }
  for(let employeeId in employees){
    const employee = employees[employeeId];
    let shouldBeAdded = true;

    for(let member of members)
      if(employeeIsMember(employee, member)){
        matchedEmployees++;

        if (!employee.parties ||
            !employee.parties.GroupMe ||
            employee.parties.GroupMe.user_id != parseInt(member.user_id, 10))
          networkRequests.push(recordGroupMeMembership(employee, member, group));

        if(member.image_url && member.image_url !== smsImageUrl){
          foundProfileImages++;

          if(member.image_url !== employee.profileUrl)
            networkRequests.push(
              (<any>employee).ref.update({ profileUrl: member.image_url })
                .then(() => savedProfileImages++))
        }

        shouldBeAdded = false;
        break;
      }

    // don't add them if they don't have the roles
    if(!employee.roles.teamMember && !employee.roles.serviceAccount)
      shouldBeAdded = false;

    if(shouldBeAdded)
      toBeAdded.push(employee);
  }

  const toBeAddedRecords: (AddMemberData|Promise<AddMemberData|undefined>|undefined)[]
    = toBeAdded.map(employee => {
    let requestData: AddMemberData = {
      nickname: employee.name,
      guid: employee.id,
    };

    if (employee.parties &&
        employee.parties.GroupMe &&
        employee.parties.GroupMe.user_id ){
      requestData.user_id = '' + employee.parties.GroupMe.user_id;
      return requestData;
    }

    return loadParty(employee, 'HotSchedules')
    .then(() => {
      const HSparty: HotSchedulesParty = employee.parties.HotSchedules;
      if(HSparty.phoneNumberObject){
        requestData.phone_number = formatPhoneNumber(HSparty.phoneNumberObject)
        return requestData;
      }

      if(HSparty.email){
        requestData.email = HSparty.email;
        return requestData;
      }

      console.log(`Could not add ${employee.name} to GroupMe because an identifier could not be found`);
    })
  });

  const evaluatedEmployeeRecordsToBeAdded = await Promise.all(toBeAddedRecords);
  const filteredRecords: AddMemberData[] = evaluatedEmployeeRecordsToBeAdded.filter(r => !!r);

  if(editMembership){
    try {
      if(filteredRecords.length)
        networkRequests.push(
          addMembers(group, filteredRecords, apiToken, options).then(results => {
            if(!results) {
              console.log("Cannot record GroupMe membership because the results were not attained");
              return;
            }

            let updates = [],
                successes = 0,
                fails = 0;

            // Compare the results to what I sent to find the employee/member
            // Every involved employee either failed or succeeded
            for(let entry of filteredRecords){
              // If the EmployeeId is found in the success list, as `guid`, it succeeded
              const member = results.members && results.members.find(checkingMember => checkingMember.guid === entry.guid) || undefined;
              const employee = employees[entry.guid];

              // Success!
              if(member){
                successes++;
                updates.push(recordGroupMeMembership(employee, member, group))
              }else{
                fails++;
                updates.push(markNotGroupMeConnected(employee));
              }
            }

            if(!options.quiet)
              console.log(`Successfully recorded ${successes} additions to GroupMe and ${fails} failed attempts.`)

            return Promise.all(updates);
          }));

      if(toBeRemoved.length)
        networkRequests.push(removeMembers(group, toBeRemoved, apiToken))
    }catch(error){
      console.log(`[manageMembership] Could not perform at least some of ${filteredRecords.length} additions and ${toBeRemoved.length} removals: ${error}`);
    }
  }else{
    console.log('Not actually editing membership');

    if(toBeRemoved.length && !options.quiet)
      console.log(`Found ${toBeRemoved.length} members to remove from the group`);
    toBeRemoved.sort((a, b) => a.member.nickname.localeCompare(b.member.nickname));
    options.listManagements && toBeRemoved.map(m =>
      console.log(
        padToLength(m.member.user_id, 20) +
        padToLength(m.member.nickname, 22) +
        (m.member.nickname !== m.member.name ? m.member.name : "")));

    if(filteredRecords.length && !options.quiet)
      console.log(`Found ${filteredRecords.length} employees to add to the group`);
    filteredRecords.sort((a, b) => a.nickname.localeCompare(b.nickname));
    options.listManagements && filteredRecords.map(e =>
      console.log(
        padToLength(e.nickname, 22) +

        ((e.email || e.user_id || e.phone_number) ?
          padToLength(e.email, 25) +
          padToLength(e.user_id, 15) +
          padToLength(e.phone_number, 15)
          :
          "No identification information")
        ));
  }

  // console.log(`Matched ${matchedEmployees} employees`);
  // console.log(`Matched ${matchedMembers} members`);
  // console.log(`Found ${foundProfileImages} images, saved ${savedProfileImages} images into employees`);

  await Promise.all(networkRequests)
    .catch(error => console.log(`[manageMembership] Error managing members: ${error}`));
}

function employeeIsMember(employee: Employee, member: Member): boolean {
  // try first to match the id's
  if(employee.parties && employee.parties.GroupMe){
    const groupMeParty = employee.parties.GroupMe;
    const userId = parseInt(member.user_id, 10);
    if(groupMeParty.user_id == userId)
      return true;

    for(let groupId in groupMeParty.groups){
      const memberRecord = groupMeParty.groups[groupId];
      if(memberRecord.user_id == userId)
        return true;
    }
  }

  // match based on name, nickname
  // Note: I can't match based off of phoneNumber/email because that data is not included in the query
  const employeeName = employee.name.trim().toLowerCase();
  const memberNickname = member.nickname.trim().toLowerCase();
  if(employeeName == memberNickname)
    return true;

  // Check if the nickname is in the format "Firstname Lastname number" ex: Jessica Nelson 2
  // To do this, check if the employee's name makes up the first part of the nickname
  if(employeeName === memberNickname.substr(0, employeeName.length))
    return true;

  const memberName = member.name.toLowerCase();
  if(employeeName == memberName)
    return true;

  // Check if at least two of the employee's names are found in the member's name
  /** Examples:
   * Employee's name        Member's name       result
   * Jessica Evan Nelson    Jessica E Nelson    true
   * Jessica Nelson         Jessica Evan Nelson true
   * Jessica                Jessica Nelson      false // only one name can be matched
   * Jessica Nelson         Jesica Nelson       false // the name's spelling does not match
   * Jessica Evan Nelson    Jessica             false // only one name is matched
   * Nelson Jessica         Jessica Nelson      true
   * */
  checkTwoNames: {
    let namesFound = 0;
    const employeeNames = employeeName.split(' '),
          memberNames = memberName.split(' ');

    if(employeeNames.length < 2 || memberNames.length < 2)
      break checkTwoNames; // There cannot be enough material to match

    for(let employeeNamePart of employeeNames)
      // Because we've already lowercased the strings, this is case insensitive
      // It is still subject to spelling differences
      if(memberNames.indexOf(employeeNamePart) > -1){
        if(namesFound++ >= 2)
          return true;
      }
  }

  return false;
}

export interface Options {
  quiet?: boolean;
  linkProfiles?: boolean; // MANUALLY_LINK_PROFILES = process.argv.indexOf('--link') > -1;
  listManagements?: boolean; // LIST_MANAGEMENTS = MANUALLY_LINK_PROFILES || process.argv.indexOf('--list') > -1;
}
