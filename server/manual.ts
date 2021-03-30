import { processBusiness, processBusinesses, Options } from './processing-frequent/process-businesses';
import * as func from "./functions";
import { env } from './firebaseAdmin';


// todo let select certain businesses for general use in this file from process.argv
const allBusinesses = false;
const businessId = 'lakewoodd5fs584s2s6'; // e.g. Ammon '8chdfsalk38l359llk'


async function info() {
  // If any of these info functions even still work, they may need to be cleaned up

  console.log("Counting Ratings");
  const numRatings = await func.countRatings(true);
  console.log(numRatings);

  const numEmployees = await Promise.all([
     func.countEmployees(businessId),
  ]);

  console.log('Employees' + numEmployees);
}

async function queryEmployees() {
  const businesses = await env.collection('businesses').get();

  for (let businessDoc of businesses.docs) {
    const cowz = await businessDoc.ref.collection('employees').doc('Q1DAfm1RjeBXVtPyZBZ5').get();
    if (cowz.exists) {
      console.log(`${businessDoc.get('info').name} has cowz`);
    }
  }
}

// Process HotSchedules and GroupMe data
async function _processBusinesses() {
  const options: Options = {
    // quiet: true,
    // noShifts: true,
    // noAnalysis: true,
    // listManagements: true
    maxPollAttempts: 10,
  };

  if (allBusinesses) {
    await processBusinesses(options);
  } else {
    const businessRef = env.collection('businesses').doc(businessId);
    const businessDoc = await businessRef.get();
    await processBusiness(businessDoc as any, options);
  }
}

// Update weekly moola budgets
async function _giveBudgets() {
  if (allBusinesses) {
    await func.giveAllBudgets();
  } else {
    const bus = await env.collection('businesses').doc(businessId).get();
    await func.giveBudgets(bus as any);
  }
}


// When running in the cloud, scripts will time out after so long so it can be good to know about how
// long it takes to run them ahead of time.
const START_TIME = new Date;

// Modify as needed for what you want to perform
const toRun = [
  // info(),
  // queryEmployees(),
  _processBusinesses(),
  //_giveBudgets(), // todo currently only works for ammon business
];

Promise.all(toRun).then(() => {
  const END_TIME = new Date;
  console.log(`Finished in ${Math.floor((+END_TIME - +START_TIME)/100) / 10}s.`);
})
