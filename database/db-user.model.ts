import { Timestamp } from '@firebase/firestore-types';

export interface DbUser {
  email: string;
  name: string;
  emailVerified: boolean;
  profileUrl: string;

  joined: Timestamp;

  businesses: EmployeeIdentifier[];
}

export interface EmployeeIdentifier {
  businessId: string;
  employeeId: string;

  // deprecated, do not use
  destinationId?: string;
  businessName?: string;
  destinationName?: string;
}
