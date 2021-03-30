const functions = require('firebase-functions');
import { processBusinesses, Options as BusinessOptions } from './processing-frequent/process-businesses';
import { deletePendingAccounts, giveAllBudgets } from './functions';

//TODO: create watcher method to update a single business when they request it
// put restrictions so that they can only request this up to one time per 60 minutes

exports.processBusinesses =
  functions.pubsub
  // .region('us-central1')
  .schedule('*/15 4-22 * * *')  // Every 15 minutes between 4am and 10 pm MT
  .timeZone('America/Denver')
  .onRun((_context) => {
    const options: BusinessOptions = {
      quiet: true,
    }
    return processBusinesses(options)
      .then(() => process.exit(0));
  });

exports.managePendingAccounts =
  functions.pubsub
  // .region('us-central1')
  .schedule('0 0 * * 1') // Once a week on Sunday[->Monday] at midnight
  .timeZone('America/Denver')
  .onRun((_context) => {
    return deletePendingAccounts()
      .then(() => process.exit(0));
  });

exports.manageBudgets =
  functions.pubsub
  // .region('us-central1')
  .schedule('0 0 * * 1') // Once a week on Sunday[->Monday] at midnight
  .timeZone('America/Denver')
  .onRun((_context) => {
    return giveAllBudgets()
      .then(() => process.exit(0));
  });

/** ESLINT articles:
 * https://stackoverflow.com/questions/53235441/eslint-unnecessarily-warning-promise-no-nesting-with-firestore-transactions
 * https://eslint.org/docs/2.13.1/user-guide/configuring
 *
 *
 * Cloud Firestore:
 * https://medium.com/@vladfr/use-cloud-firestore-with-async-bce875af0183
 * */
