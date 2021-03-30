import { DocumentReference } from '@firebase/firestore-types';
import * as time from "../time";
import { env } from '../firebaseAdmin';

const MAXIMUM_PENDING_ACCOUNT_REQUEST_DAYS = 30;

// delete old pendingAccount requests
export async function deletePendingAccounts(): Promise<true> {
  const oldPendingRefs = await env.collection('pendingAccounts')
    .where('created', '<', new Date(+(new Date) - MAXIMUM_PENDING_ACCOUNT_REQUEST_DAYS * time.oneDay))
    .get();

  // TODO: do this in a batch method to avoid flooding the memory,
  // it should be fine for now because only a few will be deleted at a time
  var deletions: Promise<any>[] = [];
  for(let pendingDoc of oldPendingRefs.docs)
    deletions.push(pendingDoc.ref.delete())

  await Promise.all(deletions)
  console.log(`Deleted ${deletions.length} old pendingAccount requests`);
  return true;
}
