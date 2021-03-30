import { DocumentSnapshot, DocumentReference, Timestamp, CollectionReference, FieldValue, QuerySnapshot } from "@firebase/firestore-types";
import { utc } from 'moment';

import { EmployeeRecord, JobId, ScheduleId } from './HotSchedules/HotSchedules.d';
import { oneHour, oneDay } from './time';
import { BusinessCreatedPendingAcccount } from '../database/pending-account.model';
import { Omit } from '../src/app/helpers/omit';
import { DbEmployee } from '../database/db-employee.model';
import { EmployeeIdentifier } from '../database/db-user.model';
import { HotSchedulesParty, PartyName } from '../src/app/services/employee-parties.model';
import { Employee, BasicEmployeeInformation } from '../src/app/services/employee.model';

import { EmployeeId } from '../src/app/organize-shifts/shift.model';
import { BusinessPermission } from '../src/app/services/business.model';

import * as firestore from './firebaseAdmin';

export function loadParty(employee: Employee, party: PartyName): Promise<true> {
  // true indicates the operation was successfull
  return (<any>employee).ref.collection('parties').doc(party).get()
    .then(doc => {
      if(!employee.parties)
        employee.parties = {};

      employee.parties[party] = doc.data() || {};
      return true;
    });
}

export function generateBasicEmployeeInformation(employeeDoc: DocumentSnapshot): BasicEmployeeInformation {
  const profileUrl = employeeDoc.get('profileUrl');
  return {
    id: employeeDoc.id,
    name: employeeDoc.get('name'),
    ...(profileUrl && { profileUrl }),
  }
}
export function createSystemEvent(employeeRef: DocumentReference, description: string): Promise<true> {
  return employeeRef.collection('history').doc().set({
    time: firestore.FieldValue.serverTimestamp(),
    kind: 'system',
    description: description,
  }).then(() => true);
}

function toTitleCase(str?: string): string | undefined {
  // https://stackoverflow.com/a/196991/2844859
  return str && str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
export async function updateEmployee(employeeRefOrDoc, HSemployee: EmployeeRecord): Promise<true> {
  const name = (toTitleCase(HSemployee.nickname) || HSemployee.firstname) + " " + HSemployee.lastname;
  const intendedData: HotSchedulesParty = {
    id: HSemployee.id,
    firstname: HSemployee.firstname,
    lastname: HSemployee.lastname,
    nickname: HSemployee.nickname,

    birthDate: new Date(HSemployee.birthDate),
    hireDate: new Date(HSemployee.hireDate),
    email: HSemployee.email.toLowerCase(),
    phoneNumber: (function(contactNumber){
      return parseInt("" + contactNumber.areaCode + contactNumber.prefix + contactNumber.number, 10);
    })(HSemployee.contactNumber),
    phoneNumberObject: HSemployee.contactNumber,
  };

  let actions = [],
      employeeRef;

  function updateName(intendedName){
    actions.push(employeeRef.update({
      name: intendedName,
    }));
  }
  if(employeeRefOrDoc.exists){
    //its an employeeDoc
    let employeeDoc = employeeRefOrDoc;

    employeeRef = employeeDoc.ref;

    if(employeeDoc.get('name') !== name)
      updateName(name);
  }else{
    //its an employeeRef
    employeeRef = employeeRefOrDoc;
    updateName(name);
  }

  //TODO: minimize the data transferred by checking whether it changes...
  //this isn't currently possible because I would have to download the data to do that
  actions.push(employeeRef.collection('parties').doc('HotSchedules').set(intendedData));

  await Promise.all(actions);
  return true;
}
export async function linkEmployeeToUser(employeeRef: DocumentReference, getConfig): Promise<boolean> {
  //boolean indicated if a link was performed
  if(!getConfig)
    throw Error('[ops.linkEmployeeToUser] getConfig was not passed in');

  // TODO: allow a OneClick email to override what is found in HotSchedules
  // This will mean creating an interface to do that, and then adjusting this logic to pull the OneClick party as well
  // I don't know, will this cause a lot of reads to the database?
  const HSemployeeSnapshot = await employeeRef.collection('parties').doc('HotSchedules').get();
  const HS_NAME = HSemployeeSnapshot.get('firstname') + " " + HSemployeeSnapshot.get('lastname');
  let email = HSemployeeSnapshot.get('email');
  if (!email)
    return false;

  let businessRef = employeeRef.parent.parent;
  let envRef = businessRef.parent.parent;
  const pendingAccountQuerySnapshot =
    await envRef.collection('pendingAccounts')
      .where('email', '==', email)
      .get();
  if (pendingAccountQuerySnapshot.size > 1) {
    // throw Error(`There are multiple pendingAccounts for the same email: ${email}`);
    console.log(`There are multiple pendingAccounts for the same email: ${email}`);
    return false;
  } else if(pendingAccountQuerySnapshot.empty) {
    let data: Omit<BusinessCreatedPendingAcccount, 'created'> & { created: FieldValue } = {
      created: firestore.FieldValue.serverTimestamp(),
      createdBy: 'business',

      email: email,
      businessId: businessRef.id,
      employeeId: employeeRef.id,
    };

    console.log(`Creating linkAccount invite for ${HS_NAME}`);
    await envRef.collection('pendingAccounts').doc().set(data);
    return false;
  }else{
    let requests = [],
        pendingAccountDoc = pendingAccountQuerySnapshot.docs[0],
        pendingAccountData = pendingAccountDoc.data();

    switch(pendingAccountData.createdBy){
      case 'user':
        const userId = pendingAccountData.userId;
        console.log(`Linking account for ${HS_NAME}`, pendingAccountData);

        let newBusiness: EmployeeIdentifier = {
          businessId: businessRef.id,
          employeeId: employeeRef.id,
        };
        requests.push(envRef.collection('users').doc(userId).update({
          businesses: firestore.FieldValue.arrayUnion(newBusiness)
        }));
        requests.push(employeeRef.update({ userId: userId }));
        requests.push(createSystemEvent(employeeRef, "Linked to user " + userId));

        console.log(`Linked employee record for ${HS_NAME} to userID ${userId}`);
        break;
      case 'business':
        // Don't do any linking.
        // Really, this should be taken care of when the user tries to login:
        // The software will have already created the stub, and then the user will link it when they finish.
        // ** of course, this gets tricky when emails and employees start changing... I need to work on it.
        // TODO: implement more robust checking for changed emails...
        return false;
        break;
      default:
        throw new Error(`Unknown pendingAccount createdBy type: ${pendingAccountData.createdBy}`);
    }

    requests.push(pendingAccountDoc.ref.delete());
    await Promise.all(requests);

    return true;
  }
}
export async function createEmployee(businessRef: DocumentReference, HSemployee: EmployeeRecord, getConfig): Promise<true> {
  //todo: actually fix the issue
  if(!getConfig)
    throw Error('[ops.createEmployee] getConfig was not passed in');

  let newEmployeeRef = businessRef.collection('employees').doc();
  let newEmployee: DbEmployee = {
    scores: {},
    roles: {
      teamMember: true,
    },
    groups: {
      newbie: true, // everyone is new when the record is first created
      // notGroupMeConnected: true,
        // I'll hold off on writing this group so that if they are connected
        // on the first pass, it will never have existed.
        // This could give insight into who worked on the first time by seeing
        // the `false` values compared to undefined ones...
        // It also might not be worth the difference.
    },
    name: "Placeholder name",

    HSId: HSemployee.id,
    archived: false,
    birthday: new Date(HSemployee.birthDate - 5*60*60*1000) as unknown as Timestamp, // subtract 5 hours so it is at the beginning of the day in UTC
      // ^^ TODO: This could be inaccurate or change based on other variables. Maybe the HotSchedules server, maybe the location of the store, maybe my location... I have no idea :(
      // Firestore will automatically save the date correctly as a Timestamp. I don't need to convert it.
    hired: firestore.FieldValue.serverTimestamp() as any,
    lastUpdated: firestore.FieldValue.serverTimestamp() as any,
  };

  // Possible improvement: streamline this process to save database calls.
  // This would come at the expense of code on the server.
  // I don't believe it's very important because this process isn't run often,
  // and it's always run from a secure server environment
  await newEmployeeRef.set(newEmployee);
  await Promise.all([
    updateEmployee(newEmployeeRef, HSemployee),
    createSystemEvent(newEmployeeRef, 'Employee record created')
  ]);

  // this has to be last to that all the information is in the database.
  await linkEmployeeToUser(newEmployeeRef, getConfig);

  return true;
}
export function unarchiveEmployee(employeeRef: DocumentReference): Promise<true> {
  return Promise.all([
    employeeRef.update({
      archived: false,
      restored: firestore.FieldValue.serverTimestamp(),
      "roles.teamMember": true, // restore the teamMember privileges in case they were removed
      lastRatingSeenBy: firestore.FieldValue.delete(), //reset this so they will be reviewed by the trainers for accuracy
      lastUpdated: firestore.FieldValue.serverTimestamp()
    }),
    createSystemEvent(employeeRef, "Employee record restored from archives")
  ]).then(() => true);
}
export function archiveEmployee(employeeRef: DocumentReference): Promise<true> {
  return Promise.all([
    employeeRef.update({ archived: true }),
    createSystemEvent(employeeRef, "Employee record archived")
  ]).then(() => true);
}
export function markNotGroupMeConnected(employee: Employee): Promise<boolean> {
  // Boolean return value indicates if the mark was added
  // NOTE: This mark is removed by the GroupMe function, recordGroupMeMembership.

  // The mark is already included
  if(employee.groups && employee.groups.notGroupMeConnected)
    return Promise.resolve(false);

  // I am intentionally ignoring the private flag on this reference call
  // because this is server code

  const employeeRef = (<any>employee).ref;
  return employeeRef.update({
    "groups.notGroupMeConnected": true,
  })
  .then(() => true);
}

export function createShift(data: BasicShiftData, getConfig){
  if(!getConfig)
    throw Error("[ops.createShift] getConfig was not passed in!");

  let storeClosesAt = (function(baseDayTimestamp, timeString){
    return utc(timeString, 'h:mm a').valueOf() % oneDay + Math.floor(+baseDayTimestamp / oneDay) * oneDay;
  })(data.timeIn, getConfig('shifts.storeClosesAt', '10:00 pm'));

  return {
    //raw data
    ownerId: data.ownerId,
    timeIn: data.timeIn,
    timeOut: data.timeOut,
    job: data.job,

    //calculated values
    prep: data.jobId === getConfig('shifts.prepJobId', 0),
    training: data.scheduleId === getConfig('shifts.trainingScheduleId', 0),
    shiftLeader: data.jobId === getConfig('shifts.shiftLeaderJobId', 0),
    closing: +data.timeOut > +storeClosesAt, //if timeOut is after the store closes, then the person `closes`
    breakNeeded: +data.timeOut - +data.timeIn >= getConfig('shifts.minimumHoursForBreak', 0) * oneHour, //if the shift is longer than a certain length
    shortShift: (function(timeIn, timeOut, jobId, scheduleId, getConfig){
      if(+timeOut - +timeIn >= getConfig('shifts.minimumShiftHours', 0) * oneHour)
        return false;

      if(getConfig('shifts.neverShort.jobIds', []).indexOf(jobId) > -1)
        return false;

      if(getConfig('shifts.neverShort.scheduleIds', []).indexOf(scheduleId) > -1)
        return false;

      return true;
    })(data.timeIn, data.timeOut, data.jobId, data.scheduleId, getConfig),

    //can't know here...
    doubleShift: false,

    //placeholders
    goneOnBreak: false,
    goneHome: false,
  };
}
export interface BasicShiftData {
  ownerId: EmployeeId;
  timeIn: Date;
  timeOut: Date;
  job: string;
  jobId: JobId;
  scheduleId: ScheduleId;
}

export async function deleteDay(dayRef: DocumentReference): Promise<true> {
  await deleteCollections(dayRef, ['shifts', 'layouts']);
  await dayRef.delete();
  return true;
}
async function deleteCollections(docRef: DocumentReference, collectionNames: string[]|[string, number][], batchSize = 50): Promise<true> {
  let collections: [string, number][];
  if(Array.isArray(collectionNames))
    collections = (collectionNames as any).map((element: any, _index: number, _array: any[]) => {
      if(typeof element[1] === 'number')
        return element;
      else
        return [element, batchSize];
    });
  else
    collections = [[collectionNames, batchSize]];

  for(let collection of collections){
    const collectionRef = docRef.collection(collection[0]);
    const batchSize = collection[1];

    await deleteCollection(firestore.firestore, collectionRef, batchSize);
  }

  return true;

  // https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=zh-tw
  async function deleteCollection(db, collectionRef, batchSize): Promise<void> {
    let query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, resolve, reject);
    });
  }
  async function deleteQueryBatch(db, query, resolve, reject): Promise<void> {
    query.get()
    .then((snapshot: QuerySnapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then((numDeleted: number) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, resolve, reject);
      });
    })
    .catch(reject);
  }
}

export async function copyCollection(src: CollectionReference, dest: CollectionReference): Promise<void> {
  // https://stackoverflow.com/a/60137639/2844859
  const documents = await src.get();
  let writeBatch = firestore.admin.firestore().batch();
  let i = 0;
  for (const doc of documents.docs) {
      writeBatch.set(dest.doc(doc.id) as any, doc.data());
      i++;
      if (i > 400) {  // write batch only allows maximum 500 writes per batch
          i = 0;
          console.log('Intermediate committing of batch operation');
          await writeBatch.commit();
          writeBatch = firestore.admin.firestore().batch()
      }
  }
  if (i > 0) {
      console.log('Firebase batch operation completed. Doing final committing of batch operation.');
      await writeBatch.commit();
  } else {
      console.log('Firebase batch operation completed.');
  }

}

function toDate(input: Date|Timestamp): Date {
  // Safely convert a Firestore Timestamp into a date
  return (input as Timestamp).toDate ? (input as Timestamp).toDate() : (input as Date);
}
export function isAllowed(input: BusinessPermission|Timestamp): boolean {
  if(!input)
    return false;

  if(typeof input === 'boolean')
    return input;

  // It must be a date representing a period that ends
  const now = new Date;
  return +now >= +toDate(input);
}
