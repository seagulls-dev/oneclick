import { DocumentReference} from "@firebase/firestore-types";
import { deletePendingAccounts } from "./delete-pending-accounts";
import { giveBudgets } from "./give-budgets";
import { countRatings } from "./count-ratings";

import { Options } from "../processing-frequent/process-businesses";

export default async function weeklyProcessing(env: DocumentReference, options?: Options): Promise<void> {
  await deletePendingAccounts(env);

  const businesses = await env.collection('businesses').get();
  console.log(`Performing weekly processing for ${businesses.size} businesses`);

  for(let businessDoc of businesses.docs){
    await giveBudgets(businessDoc);
    await countRatings(businessDoc);
  }
}
