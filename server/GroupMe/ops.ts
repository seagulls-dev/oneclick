const request = require('request');

import { Group, Envelope, AddMemberData, Member, AddMemberResults, AddMemberResponse } from './GroupMe.d';
import { Employee } from '../../src/app/services/employee.model';
import { SmallGroupMeMember, GroupMeParty } from '../../src/app/services/employee-parties.model';
import { Omit } from '../../src/app/helpers/omit';
import { createSystemEvent } from '../operations';
import { ContactNumber } from '../HotSchedules/HotSchedules.d';

const BASE_URL = "https://api.groupme.com/v3";

async function _delay(ms: number): Promise<void> {
  // From: https://stackoverflow.com/a/37764963/2844859
  // Use to wait asychronously.
  // USAGE (within an async function):
    // await _delay(300);
  return new Promise( resolve => setTimeout(resolve, ms) );
}
function _requestResponse(resolve: (Envelope) => void, reject: (string) => void): (error, response, body) => void {
  return function handleResponse(error, _response, body){
    if(error)
      return reject(error);

    if(!body)
      return reject(`Body is not defined`);

    const data: Envelope<any> = typeof body === 'string' ? JSON.parse(body) : body;
    return resolve(data);
  }
}
function _buildUrl(partialUrl: string, apiToken: string): string {
  return `${BASE_URL}${partialUrl}?token=${apiToken}`;
}
function getData(partialUrl: string, apiToken: string): Promise<Envelope<any>> {
  return new Promise((resolve, reject) => {
    const url = _buildUrl(partialUrl, apiToken);
    request(url, _requestResponse(resolve, reject));
  });
}
function postData(partialUrl: string, apiToken: string, formData?: any): Promise<Envelope<any>> {
  return new Promise((resolve, reject) => {
    const url = _buildUrl(partialUrl, apiToken);
    let postData: { url: string; json?: any; headers?: any; } = { url }
    if(formData)
      postData.json = formData;

    postData.headers = {
      "X-Access-Token": apiToken,
    }

    request.post(postData, _requestResponse(resolve, reject));
  });
}


export function padToLength(string: string|undefined, length: number, placeholder = " ", addToLeft = false): string {
  if(!placeholder.length)
    throw Error('Placeholder must have length');

  if(!string || !string.length)
    string = "";

  while(string.length < length)
    if(addToLeft)
      string = placeholder + string;
    else
      string = string + placeholder;

  return string;
}
export function formatPhoneNumber(phone: ContactNumber): string {
  // The end format will look like this: '+1 1234567890'
  return `+${phone.countryCode} ` +
          padToLength(''+phone.areaCode, 3, '0', true) +
          padToLength(''+phone.prefix,   3, '0', true) +
          padToLength(''+phone.number,   4, '0', true);
}

export function getGroup(id: number|string, apiToken: string): Promise<Group> {
  return getData('/groups/' + id, apiToken)
    .then(data => {
      if(data.meta.code === 200)
        return data.response;

      throw Error(`Failed to getGroup: ` + data.meta.errors.join('; '));
    });
}

function _convertStringLikeNumbersToNumbers(obj: any): { [propName: string]: string|number } {
  var convertedObj = {};
  for(let key in obj){
    const value = obj[key];
    const numeric = +value; // parseInt(value, 10) // The latter supports strings that begin with numbers and contain letters

    // If the numeric is not NaN, then value is a number
    const isNumber = !isNaN(numeric);
    convertedObj[key] = isNumber ? numeric : value;
  }

  return convertedObj;
}
export function recordGroupMeMembership(employee: Employee, member: Member, group: Group): Promise<void> {
  const employeeRef = (<any>employee).ref;
  const partyRef = employeeRef.collection('parties').doc('GroupMe');
  const newGroup = _convertStringLikeNumbersToNumbers(member);
  let GroupMeParty: Omit<GroupMeParty, "groups"> & { groups?: any } = {
    user_id: parseInt(member.user_id, 10),
  }

  // Sometimes the payload can be missing some fields.. I don't know why
  // I think this happens after adding members to a group and reading the response
  // If any of the values in our generated GroupMeParty are undefined, fail quitely without crashing the script
  for(let prop in GroupMeParty){
    if(GroupMeParty[prop] === undefined){
      console.log(`Did not recordGroupMeMembership for ${member.name || member.nickname || employee.name} because some properties are undefined`);
      return Promise.resolve();
    }
  }

  let updates = [];

  // if the party already exists, update it. Otherwise, create it.
  if(employee.parties.GroupMe && employee.parties.GroupMe.user_id){
    GroupMeParty[`groups.${group.id}`] = newGroup;
    updates.push(partyRef.update(GroupMeParty))
  }else{
    GroupMeParty.groups = {};
    GroupMeParty.groups[group.id] = newGroup;
    updates.push(partyRef.create(GroupMeParty))
  }

  updates.push(createSystemEvent(employeeRef, `Linked to GroupMe profile for ${member.name || member.nickname}`));

  // Remove the flag set by operations.markNotGroupMeConnected, if it exists
  if(employee.groups && employee.groups.notGroupMeConnected)
    updates.push(employeeRef.update({
      "groups.notGroupMeConnected": false, // TODO: we could also delete the value
    }))

  return Promise.all(updates)
  .then(() => console.log(`[ops.ts] Linked employee ${employee.name} to member ${member.nickname} on ${group.id}`))
  .catch(err => console.log(`[ops.recordGroupMeMembership] error: ${err}`));
}
export async function addMembers(group: Group, members: AddMemberData[], apiToken: string, options?: Options): Promise<AddMemberResults|undefined> {
  // This function will return the GroupMe response
  // (after polling it several times) if it can be attained,
  // or undefined after several tries
  if(!options) options = {};

  const MAX_MEMBERS_AT_A_TIME = 10;
  if(members.length > MAX_MEMBERS_AT_A_TIME){
    // The rest will be added on subsequent runs of the function
    console.log(`[GroupMe/opts.ts:addMembers] limiting ${members.length} addMember requests to ${MAX_MEMBERS_AT_A_TIME} because of GroupMe restrictions`);

    // Take them from the end so failed attempts don't snowball in the beginning
    // cluttering up space for more new ones
    members = members.slice(0, MAX_MEMBERS_AT_A_TIME * -1);
  }else if(!options.quiet)
    console.log(`Adding ${members.length} members to Group ${group.name || group.id}`);

  const formData = {
    language: "en-US",
    members,
  }

  const data: Envelope<AddMemberResponse> = await postData(`/groups/${group.id}/members/add`, apiToken, formData);
  if(data.meta.code !== 202)
    throw Error(`${data.meta.code}: ${data.meta.errors && data.meta.errors.join('; ')}`);

  const resultsId = data.response.results_id;

  const MAX_ATTEMPTS = options.maxPollAttempts || 3;
  const ATTEMPT_SPACING_MS = 500;

  const partialUrl = `/groups/${group.id}/members/results/${resultsId}`;

  var attempts = 0;
  do {
    await _delay(ATTEMPT_SPACING_MS);

    // console.log(`Polling ${_buildUrl(partialUrl, apiToken)}`);
    let data: Envelope<AddMemberResults> = await getData(partialUrl, apiToken);
    if(!data || data.meta.code === 503){
      if(!options.quiet)
        console.log("Results from query to add members to GroupMe are not ready.");
      continue;
    }else if(data.meta.code === 404){
      if(!options.quiet)
        console.log("Results from query to add members to GroupMe are no longer available. Giving up.");
      break;
    }

    return data.response; // Success!!
  }while(++attempts < MAX_ATTEMPTS)

  if(!options.quiet)
    console.log(`AddMember results can be found at: ${_buildUrl(partialUrl, apiToken)}`);
  return undefined; // The response could not be found
}
export function removeMembers(group: Group, records: RemoveMemberRecord[], apiToken: string): Promise<void> {
  let networkRequests = [];
  for(let record of records)
    networkRequests.push(
      postData(`/groups/${group.id}/members/${record.member.id}/remove`, apiToken)
      .then(data => {
        if(data.meta.code == 200)
          return data.response;

        throw Error(data.meta.errors.join('; '));
      })
      .then(async response => {
        if(record.employee){
          await createSystemEvent((<any>record.employee).ref, `Removed from GroupMe group: ${group.name}`);
          console.log(`Removed ${record.member.nickname} from ${group.name}`);
        }else
          console.log(`Could not log member removal for ${record.member.name || record.member.nickname} ` +
                      `because it is not linked to an Employee Profile.`, response);
      })
      .catch(error => console.log(`Failed to remove ${record.member.name || record.member.nickname} from ${group.name}: ${error}`))
    );

  return Promise.all(networkRequests)
    .then(() => {});
}

export interface RemoveMemberRecord {
  member: Member;
  employee?: Employee;
}
export interface Options {
  quiet?: boolean;
  maxPollAttempts?: number;
}
