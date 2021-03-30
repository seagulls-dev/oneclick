import { Timestamp } from '@firebase/firestore-types';

import { Score, PositionRequest, RoleId, BillMap, PositionHistory } from '../src/app/services/employee.model';
import { CalculatedEmployeeGroups } from '../src/app/services/employee-groups.model';

//real file located in app/src/services/employee.model.ts
export interface DbEmployee {
  requestedPosition?: PositionRequest;
  recommendedPosition?: PositionRequest;
  scores: { [positionId: string]: Score };
  groups: CalculatedEmployeeGroups;
  positionHistory?: PositionHistory;
  roles: { [K in RoleId]?: boolean };

  mooLa?: number;
  mooLaBudget?: number; // A weekly-replenished budget of Moo-La for leaders to disburse
  mooLaDisbursed?: number; // Weekly total of how much was given. This will be cleared and written as a log statement weekly.
  mooLaBills?: BillMap;

  // Keep track of these weekly for history purposes
  ratingsThisWeek?: number;
  minutesRatingThisWeek?: number;

  name: string;
  nickname?: string;
  HSId: number;
  userId?: string;
  profileUrl?: string;
  pin?: number;
  isAdminAccount?: boolean; // indicates that the record has high level permissions, beyond the scope of a business`

  archived: boolean;
  hired: Timestamp;
  restored?: Timestamp; // for marking them as newbies when they are recently recovered from the archives
  birthday: Timestamp; // from HotSchedules
  lastUpdated: Timestamp;
}
