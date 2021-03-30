import { DocumentSnapshot } from "@firebase/firestore-types";

// This script is still very manual
import { BasicEmployeeInformation } from "../../src/app/services/employee.model";
import { GroupMooLaTransaction } from "../../database/db-moola-transaction.model";
import { WeeklyBudget as BasicWeeklyBudget } from "../../src/app/config/moola-config.model";

import { createSystemEvent, generateBasicEmployeeInformation, isAllowed } from "../operations";
import { FieldValue, env } from '../firebaseAdmin';

const START_TIME = new Date;

// TODO: generalize with weekly budget in config
const budgets: WeeklyBudget = {
  trainer: 10,
  teamLeader: 20,
  shiftLeader: 40,
  manager: 50,
}

export async function giveAllBudgets(): Promise<void> {
  const businesses = await env.collection('businesses').get();
  for (let businessDoc of businesses.docs) {
    try {
      await giveBudgets(businessDoc as any);
    } catch (e) {
      const name = businessDoc.get('info') && businessDoc.get('info').name;
      console.log(`Error processing business ${name}: ${e}`);
    }
  }
}

export async function giveBudgets(businessDoc: DocumentSnapshot): Promise<void> {
  const businessName = businessDoc.get('info').name;
  if(!isAllowed(businessDoc.get('useMooLa'))) {
    console.log(`${businessName}: MooLa disabled`);
    return Promise.resolve();
  }

  const businessRef = businessDoc.ref;
  const employeesRef = businessRef.collection('employees');
  const DaCowzAcountId: string = (await businessRef.collection('config').doc('server').get()).get('storeEmployeeId');

  const [DaCowzAccountSnapshot, leadersQuerySnapshot] = await Promise.all([
    employeesRef.doc(DaCowzAcountId).get(),
    // TODO: minimize the overlapping portion
    //  Though there will be overlap between these groups,
    //  pull them seperately because the state can change
    employeesRef.where('groups.leader', "==", true).where('archived', '==', false).get()
  ]);

  var interGroupStats: processDocsResult = {
    toGroup: [],
    budgetAlloted: 0,
    mooLaDisbursed: 0,
  }

  // TODO: Roles that can grant unlimited MooLa need to 'have' 1 more than every one else
  // so it sorts correctly.
  budgets.unlimited = Math.max(...(Object.values(budgets) as number[])) + 1;


  // Process the main group of employees
  await processDocs(leadersQuerySnapshot.docs, budgets, interGroupStats);

  // These will only be people who were removed from office because I already
  // set everyone else to 0. Doing it like this increases the number of sets
  // of trips to the server, but minimizes the overlap between the two groups.
  const disbursedQuerySnapshot = await employeesRef.where('mooLaDisbursed', ">", 0).get();
  await processDocs(disbursedQuerySnapshot.docs, budgets, interGroupStats);

  var finalWrites = [];

  // Write the group transaction recording how much was supplied to the team
  if(interGroupStats.budgetAlloted){
    const newTransaction: GroupMooLaTransaction = {
      type: 'supply',
      value: interGroupStats.budgetAlloted,

      employees: interGroupStats.toGroup.map(employee => employee.id),
      toGroup: interGroupStats.toGroup,

      from: {
        employee: generateBasicEmployeeInformation(DaCowzAccountSnapshot)
      },
      timestamp: FieldValue.serverTimestamp() as any, // Type matches well enough for adding the transaction
      forReason: `leeding our team to VICTory! $${budgets.director} for directorz, $${budgets.manager} for managerz, $${budgets.shiftLeader} for shift leederz, $${budgets.teamLeader} for team leederz, $${budgets.trainer} for trainerz!!`,
    }
    finalWrites.push(businessRef.collection('mooLaTransactions').add(newTransaction));
  }else
    console.log(`${businessName}: No MooLa supplied this week`);

  // Write a history event on Da Cowz recording how much was disbursed by the team
  if(interGroupStats.mooLaDisbursed > 0){
    const accountingMessage = `Cow representatives handed out a total of $${interGroupStats.mooLaDisbursed} Moo-La to the team this week.`;
    finalWrites.push(createSystemEvent(DaCowzAccountSnapshot.ref, accountingMessage));
  }else
    console.log(`${businessName}: No MooLa disbursed this week`);

  await Promise.all(finalWrites);

  const END_TIME = new Date;
  console.log(`${businessName}: Distributed budgets totalling ${interGroupStats.budgetAlloted} to ${interGroupStats.toGroup.length} leaders! We're saving the world! (${Math.floor((+END_TIME - +START_TIME)/100) / 10}s)`);
}

interface processDocsResult {
  budgetAlloted: number;
  mooLaDisbursed: number;
  toGroup: BasicEmployeeInformation[];
}
function processDocs(docs, budgets: WeeklyBudget, stats: processDocsResult): Promise<void> {
  // Note: this `stats` pattern relies on the objects being passed by reference in and out of the function
  var networkCalls = [];

  for(let employeeDoc of docs){
    const employee = employeeDoc.data();
    if(!employee.roles)
      employee.roles = {};

    let maxBudget = 0;

    // Assume that directors can give out unlimited MooLa
    // TODO: load the process the permission config to figure this out for real
    if(employee.roles.director){
      maxBudget = budgets.unlimited;
    }else if(!employee.archived && employee.roles.teamMember){
      for(let roleId in budgets)
        if(employee.roles[roleId] === true)
          maxBudget = Math.max(maxBudget, budgets[roleId]);

      // Back-of-House trainers should have the limit of a team leader
      if(employee.groups['destination-backOfHouse'] && employee.roles['trainer'])
        maxBudget = Math.max(maxBudget, budgets['teamLeader']);
    }

    // Generate a system event logging how much was granted away
    if(employee.mooLaDisbursed > 0){
      const message = `Granted $${employee.mooLaDisbursed} Moo-La this week.`;
      networkCalls.push(createSystemEvent(employeeDoc.ref, message));
    }

    stats.budgetAlloted += maxBudget;
    stats.mooLaDisbursed += employee.mooLaDisbursed || 0;

    // Give the leaders their mooLa
    networkCalls.push(employeeDoc.ref.update({
      mooLaDisbursed: 0,
      mooLaBudget: maxBudget,
    }));

    if(maxBudget)
      stats.toGroup.push(generateBasicEmployeeInformation(employeeDoc));
  }

  return Promise.all(networkCalls)
    .then(() => {});
}

type WeeklyBudget = BasicWeeklyBudget & { unlimited?: number }; // represents the amount for those
