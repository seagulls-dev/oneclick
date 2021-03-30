import * as admin from 'firebase-admin';

const CREDENTIAL_REFERENCE = "HotAutoScheduler-83cc0b4f520d.json";
const DATABASE_URL = "https://hotautoscheduler.firebaseio.com";

let BETA_DATA = process.argv.indexOf("-p") === -1;

var firebaseFunctionEnvironment = false;
try{
  var serviceAccount = require("./" + CREDENTIAL_REFERENCE);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL,
  });
}catch(error){
  // the credential refence does not exist.

  // right now I expect this when I run on Firebase functions
  // console.log("Error initializing service account:",error);

  // instead just initialize the app for that priviledged, secure environment
  firebaseFunctionEnvironment = true;
  if(!BETA_DATA)
    console.warn(`WARNING: forcing BETA mode for FirebaseFunctions`);
  BETA_DATA = true; //Warn about this if it was trying to go in production mode
  admin.initializeApp();
}

console.log(`Firebase initiating in ${BETA_DATA ? "DEV" : "PROD"} mode${firebaseFunctionEnvironment ? " for Firebase Functions" : ""}!`);

const firestore = admin.firestore();
firestore.settings({
  timestampsInSnapshots: true,
});

export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
export const env = firestore.collection('environments').doc(BETA_DATA ? "DEV" : "PROD");
export { admin, firestore };
