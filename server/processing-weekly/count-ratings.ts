import { DocumentSnapshot } from "@firebase/firestore-types";

import { isAllowed } from "../operations";


// TODO: provide typing information for these arguments
export async function countRatings(businessDoc: DocumentSnapshot): Promise<void> {
  if(!isAllowed(businessDoc.get('useMooLa')))
    return Promise.resolve(); // MooLa isn't allowed

  const START_TIME = new Date;

  const businessRef = businessDoc.ref;
  const employeesRef = businessRef.collection('employees');

  await Promise.all([]);

  const END_TIME = new Date;
  console.log(`Evaluated in ${Math.floor((+END_TIME - +START_TIME)/100) / 10}s.`);
}

interface Stats {

}
function processDocs(docs, stats: Stats): Promise<void> {
  // Note: this `stats` pattern relies on the objects being passed by reference in and out of the function
  var networkCalls = [];

  for(let employeeDoc of docs){
    const employee = employeeDoc.data();
    if(!employee.roles)
      employee.roles = {};

  }

  return Promise.all(networkCalls)
    .then(() => {});
}
