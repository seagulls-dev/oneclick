import { copyCollection } from '../operations';
import { DbBusiness } from '../../database/db-business.model';
import { execSync } from 'child_process';
let firestore = require('../firebaseAdmin.js');

export default async function copy(oldStoreId: string, newStoreId?: string): Promise<void> {
  // If no new storeId is provided, it will be auto-generated

  const businessesRef = firestore.env.collection('businesses');
  const oldStoreRef = businessesRef.doc(oldStoreId);
  const newStoreRef = businessesRef.doc(newStoreId ? newStoreId : undefined);

  var oldStoreBusinessDoc, oldBusinessData: DbBusiness;

  async function step1(){
    console.log("Step 1 -- Generate the new business");

    oldStoreBusinessDoc = await oldStoreRef.get();
    oldBusinessData = oldStoreBusinessDoc.data();

    // TODO: generate the config files here in the filesystem
    // CONSIDER: creating the new businesses based on the files instead of reading
    // from Firestore.
    // TODO: switch to storing the config areas by businessId instead of CFA's StoreId (number)

    return;
    await newStoreRef.set(oldBusinessData);
  }
  async function step2(){
    console.log("Step 2 -- Copy high level collections");

    for(let collectionId of ['config', 'destinations'])
      await copyCollection(oldStoreRef.collection(collectionId), newStoreRef.collection(collectionId))
  }
  async function step3(){
    console.log("Step 3 -- Copy destination info");

    for(let destination of oldBusinessData.destinationInfo){
      const oldDestinationConfig = oldStoreRef.collection('destinations').doc(destination.id).collection('config');
      const newDestinationConfig = newStoreRef.collection('destinations').doc(destination.id).collection('config');
      await copyCollection(oldDestinationConfig, newDestinationConfig);
    }
  }
  async function step4(){
    console.log("Step 4 -- Key employees");

    // Da Cowz and James Finlinson
    const employeeIds = ['Q1DAfm1RjeBXVtPyZBZ5', 'qTeDg45UgzyHxldS0R4m'];

    for(let employeeId of employeeIds){
      const meDoc = await oldStoreRef.collection('employees').doc(employeeId).get();
      const meData = meDoc.data();
      await newStoreRef.collection('employees').doc(employeeId).set(meData);
    }
  }
  async function step5(){
    console.log("Step 5 -- Scrape data from HotSchedules")

    // Update the Login info
    // Run a basic scrape
  }

  return Promise.resolve()
  .then(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(step5)
  .catch(error => console.error("Error copying business", error))
  .then(() => console.log(`Finished copying business`));
}
