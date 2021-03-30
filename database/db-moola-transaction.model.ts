import { Timestamp, FieldValue } from '@firebase/firestore-types';
import { Omit } from '../src/app/helpers/omit';

import { SubmittedBy } from '../src/app/auth/submitted-by.model';
import { BasicEmployeeInformation, EmployeeId } from '../src/app/services/employee.model';

/** TERMINOLOGY
 * Give: use one's personal MooLa to give to another
 * Grant: take from one's weekly budget (unless they can give out unlimited) MooLa to give to another
 * Charge: Subtract MooLa from another's personal store to spend on things
 * Supply: Increase or reset a one's weekly budget
 *
 * */


interface BasicMooLaTransaction {
  value: number; // the amount of MooLa
  timestamp: Timestamp;
  type: string;

  employees: EmployeeId[];

  // This reason answers the question:
    // I'm giving this to him for...
  // On supply transactions, it will likely feel like a toPurpose
    // I'm giving you this to... (make up for a mistake, give to those in the rain...)
  forReason: string; // Ex: working hard today!!!
}

interface SendTransaction extends BasicMooLaTransaction {
  type: 'give'|'grant'|'supply';
  from: SubmittedBy; // the person who is giving/granting Moo-La
}
export interface MooLaTransaction extends SendTransaction {
  to: BasicEmployeeInformation; // the person who is receiving Moo-La
}
export interface GroupMooLaTransaction extends SendTransaction {
  toGroup: BasicEmployeeInformation[]; // the people who are receiving Moo-La
}

export interface ChargeMooLaTransaction extends BasicMooLaTransaction {
  // the money goes towards buying the cows new cow bells ;)

  type: "charge";
  from: BasicEmployeeInformation; // the person paying Moo-La
  by: SubmittedBy; // the person being the 'cashier';
}

export type PreppingTransaction =
  Omit<MooLaTransaction, "timestamp"|"employees"> |
  Omit<GroupMooLaTransaction, "timestamp"|"employees"> |
  Omit<ChargeMooLaTransaction, "timestamp"|"employees">;
