import { EmployeeIdentifier } from './db-user.model';

/** USAGE note:
 *  Users/employees are tracked by their email address.
 *  When the server notices new emails in HotSchedules,
 *  it will first attempt to link it to a user who has
 *  already tried to login (by email), and then it will
 *  store information about the business, destination,
 *  employee in this collection.
 *
 *  When the users login in, they look for this extra
 *  information to map to an employee with permissions
 *  inside a business. If a record is not found, the
 *  user will leave a trail for the server to connect
 *  eventually.
 * */

type GeneralPendingAccount = {
  createdBy: 'user'|'business';
  created: Date;
  email: string;
  // phoneNumber: number; //I don't easily have this data yet
}

export type UserCreatedPendingAccount =
  GeneralPendingAccount & {
    createdBy: 'user';
    userId: string;
  }

export type BusinessCreatedPendingAcccount =
  GeneralPendingAccount &
  EmployeeIdentifier & {
    createdBy: 'business';
  }

export type PendingAccount<T> =
  T extends UserCreatedPendingAccount ?
  UserCreatedPendingAccount :
  BusinessCreatedPendingAcccount;
