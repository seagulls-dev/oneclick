import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

import { CollectionReference, DocumentReference } from '@firebase/firestore-types';
import { ContainedBusinessConfig } from './config';
import { processBusiness } from '../processing-frequent/process-businesses';
import * as admin from '../firebaseAdmin';
import { BasicEmployee } from '../../src/app/services/employee.model';
import { BusinessCreatedPendingAcccount } from '../../database/pending-account.model';

const SPECIAL_DIRECTORY_NAMES = ['SHARED', 'DEMO_TEMPLATE'];

// Assumes generated/ran js is at server/generatedConfig/server/config/configurations.js
// and original is at server/config/configurations.ts
const generatedConfigPath = path.dirname(path.dirname(__dirname));
const serverPath = path.dirname(generatedConfigPath);
const buildingsConfigPath = path.join(serverPath, 'config');

// Process command line args
let dryRun = false; // If true, only show what would be done (don't actually do anything)
let all = false; // If true, run on all businesses
let hotSchedules = false; // If true, run hotSchedules business processing on it
const specifiedBusinesses = process.argv.slice(2);
const dryIndex = process.argv.indexOf('--dry');
const allIndex = process.argv.indexOf('--all');
const hsIndex = process.argv.indexOf('--hs');
if (dryIndex > -1) {
  // Not a business, remove from list
  dryRun = true;
  specifiedBusinesses.slice(dryIndex, 1);
}
if (hsIndex > -1) {
  hotSchedules = true;
  specifiedBusinesses.slice(hsIndex, 1);
}
if (allIndex > -1) {
  all = true;
  console.log('Processing all businesses');
} else if (specifiedBusinesses.length) {
  console.log(`Processing only ${specifiedBusinesses}`);
} else {
  console.log('No businesses specified. Run again and specify businesses using the directory names,');
  console.log(`Or pass --all to run on all businesses.`);
  process.exit(1);
}


async function setConfigurations(docRef: DocumentReference, configData) {
  if(!configData || !configData.config)
    return [];

  let requests = [],
      configRef = docRef.collection('config');

  for(let configType in configData.config) {
    if (dryRun) {
      console.log(`${configType}: ${Object.keys(configData.config[configType]).join(', ')}`);
    } else {
      requests.push(configRef.doc(configType).set(configData.config[configType]));
    }
  }

  if(configData.document) {
    if (dryRun) {
      console.log(`document:${docRef.id} in parent:${docRef.parent.parent.id}`);
    } else {
      const snapshot = await docRef.get();
      if (snapshot.exists) {
        requests.push(docRef.update(configData.document));
      } else {
        requests.push(docRef.set(configData.document));
      }
    }
  }

  return requests;
}

async function tscBusiness(businessIDName: string): Promise<ContainedBusinessConfig|undefined> {
  console.log(`${businessIDName}: TSC build`);

  const originalPath = path.join(buildingsConfigPath, businessIDName);

  // Without --experimentalDecorators, get a lot of warnings that we don't care about
  const cmd = `tsc ${originalPath}/*.ts --outDir ${generatedConfigPath} --experimentalDecorators`;
  if (dryRun) {
    console.log(cmd);
    return;
  } else {
    execSync(cmd);
  }

  const builtPath = path.join(generatedConfigPath, 'server', 'config', businessIDName, 'index.js');

  if(!fs.existsSync(builtPath))
    throw Error("File doesn't exist: " + builtPath);

  const business = require(builtPath)['default'];

  if (!business) {
    throw Error(`Business couldn't be found: ${businessIDName}`);
  }

  return business;
}

// Make service account 'Da Cowz', used for:
//  distributing MooLa if/when appropriate
//  a store computer's "always-logged-in" employee for easy use
async function setupStoreEmployee(businessRef: DocumentReference, business: ContainedBusinessConfig) {
  const serverConfig = business.config.server;
  const storeEmployeeId = serverConfig.storeEmployeeId;
  const businessName = business.document.info.name;
  if (!storeEmployeeId) {
    console.log(`${businessName}: (warning) no store employee!`);
    return;
  }

  // Make sure user of email exists (if email provided) and is linked to employee id
  const storeEmployeeEmail = serverConfig.storeEmployeeEmail;
  let userId: string;
  if (storeEmployeeEmail && storeEmployeeEmail !== '##STORE_EMAIL##') {
    const users = admin.env.collection('users');
    const storeUsers = await users.where('email', '==', storeEmployeeEmail).get();
    if (storeUsers.empty) {
      // No user yet, make a pending account instead
      const pendingAccounts = admin.env.collection('pendingAccounts');
      const pendingStoreUsers = await pendingAccounts.where('email', '==', storeEmployeeEmail).get();
      if (pendingStoreUsers.empty) {
        // Make pendingAccount with the given email
        const pendingStoreUser: BusinessCreatedPendingAcccount = {
          email: storeEmployeeEmail,
          employeeId: storeEmployeeId,
          businessId: businessRef.id,
          createdBy: 'business',
          created: new Date,
        };
        await pendingAccounts.add(pendingStoreUser);
      } else if (pendingStoreUsers.size > 1) {
        console.log(`${businessName}: (warning) multiple pending accounts with email ${storeEmployeeEmail}!`);
        return;
      } else {
        // Already a pending account
        const pendingStoreUser = pendingStoreUsers.docs[0];
        if (pendingStoreUser.get('userId')) {
          // If has a userId already, then a user should exist and we never should reach here
          console.log(`${businessName}: (warning) pending account has userId, but no user exists for ${storeEmployeeEmail}!`);
        } else {
          // Just make sure has correct business info
          await pendingStoreUser.ref.update({
            employeeId: storeEmployeeId,
            businessId: businessRef.id,
          });
        }
      }
    } else if (storeUsers.size > 1) {
      console.log(`${businessName}: (warning) multiple users with email ${storeEmployeeEmail}`);
    } else {
      // Exactly one user already exists, grab that id
      const storeUser = storeUsers.docs[0];
      // Make sure listed in user's businesses
      await storeUser.ref.update({businesses: admin.FieldValue.arrayUnion({
        businessId: businessRef.id,
        employeeId: storeEmployeeId
      })});
      userId = storeUser.id;
    }
  }

  // Make sure employee exists and is linked to user id
  const storeEmployeeRef = businessRef.collection('employees').doc(storeEmployeeId);
  if (!(await storeEmployeeRef.get()).exists) {
    const employee: BasicEmployee = {
      name: 'Da Cowz',
      hired: new Date,
      birthday: new Date,
      roles: {
        serviceAccount: true
      },
      profileUrl: 'https://i.groupme.com/572x572.jpeg.07edc08bd92246e6a3acd694b75fd6d9'
    }
    if (userId) {
      employee.userId = userId;
    }
    await storeEmployeeRef.set(employee);
  } else if (userId) {
    await storeEmployeeRef.update({userId});
  }
}

async function configureBusiness(businessesRef: CollectionReference, business: ContainedBusinessConfig) {
  if(!business)
    throw TypeError("Cannot process an undefined business!");

  if(!business.businessId || business.businessId === "##BUSINESS_ID##")
    throw TypeError(`The Business ID must be defined and not the default. Found: ${business.businessId}`);

  let businessRef = businessesRef.doc(business.businessId),
      requests = [];

  const businessName = business.document && business.document.info.name || business.businessId;

  if(business.skip) {
    console.log(`${businessName}: Skipping because of a setting in its index.ts file`);
    return;
  }
  console.log(`${businessName}: Setting config`);

  let doHotSchedules = hotSchedules;
  const snapshot = await businessRef.get();

  // todo encountering an issue where this hs processing will start before the business is created in the database,
  // causing an error. May be enough to just wait a bit before starting hs processing, but should look into more.
  // if (!snapshot.exists) {
  //   // First time business used, try hot schedules
  //   doHotSchedules = true;
  // }

  requests.push(...await setConfigurations(businessRef, business));

  let destinationsRef = businessRef.collection('destinations');
  for(let destinationId in business.destinations){
    let destination = business.destinations[destinationId],
        destinationRef = destinationsRef.doc(destinationId);

    // console.log(`Setting config for destination ${destinationId}: ${Object.keys(destination.config || {}).join(', ')}`);
    // console.log(`Setting config for destination ${destinationId}`);
    requests.push(...await setConfigurations(destinationRef, destination));
  }

  await Promise.all(requests);

  await setupStoreEmployee(businessRef, business);

  if (doHotSchedules) {
    console.log(`${businessName}: Running HotSchedules processing`);
    await processBusiness(snapshot);
  }
}

/**
 * Sets up and sends all buildings' data to the database.
 **/
export async function sendAll() {
  const businessesRef = admin.env.collection('businesses');

  try {
    const files = fs.readdirSync(buildingsConfigPath);

    //listing all files using forEach
    files.forEach(async function (file) {
      file = file + ""; // Necessary or no?
      const filepath = path.join(buildingsConfigPath, file);

      if(SPECIAL_DIRECTORY_NAMES.indexOf(file) > -1)
          return;

      // Do whatever you want to do with the file
      if(!fs.lstatSync(filepath).isDirectory())
        return;

      if (!all && (specifiedBusinesses.indexOf(file) < 0)) {
        // Specified some businesses, and this is not one of them
        return;
      }

      try {
        const business = await tscBusiness(file);
        await configureBusiness(businessesRef as any, business);
      } catch(error) {
        console.error(`Error processing business in folder ${file}: `, error);
      }
    });
  }catch(error){
    throw Error(`Unable to scan directory, ${buildingsConfigPath}: ` + error);
  }
}

sendAll();
