// usage: node update-version.js BUSINESS_ID VERSION_NUMBER
import * as firestore from './firebaseAdmin';
const version = process.argv[2];


// Old method, updating the version of each individual business
async function oldUpdateVersions() {
  const businesses = await firestore.env.collection('businesses').get();
  for (let businessDoc of businesses.docs) {
    await businessDoc.ref.update({version});
  }
}

// New method, just need to update on an environment level
async function updateVersion() {
  await firestore.env.update({version});
  console.log(`Updated version to: ${version}`)
}

//oldUpdateVersions();
updateVersion();
