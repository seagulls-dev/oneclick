import { BasicUserInformation } from './app-user.model';
import { BasicEmployeeInformation } from '../services/employee.model';
import { DestinationId } from '../services/destination.model';
import { BusinessId } from '../services/business.model';

export interface SubmittedBy {
  // User should always be supplied, except (currently) for give-budgets from Da Cowz
  // Also note, older such transactions used from: {<employee info>} directly
  user?: BasicUserInformation;
  employee: BasicEmployeeInformation;
}

export interface BasicIdData {
  submittedBy: SubmittedBy;
  destination: { id: DestinationId; name: string; };
  business: { id: BusinessId; name: string; };
}
