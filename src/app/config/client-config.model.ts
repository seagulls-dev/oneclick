import { LayoutGenerationConfig, PositionId } from './layout-generation-config.model';
import { RoleId } from '../services/employee.model';

import { CriteriaId } from './training-config.model';
import { ClientPermissionConfig } from './client-permission-config.model';
import { DestinationInfo } from '../services/destination.model';

export interface ClientConfig {
  // Duplicated from the destination definition
  // Putting this here makes it easier to use the values in the code
  destinationName?: string;
  destinationId?: string;

  fullDateDisplayFormat?: string;
  shortDateDisplayFormat?: string;
  timeDisplayFormat?: string;
  shortTimeDisplayFormat?: string;
  viewLayoutHistoryDays?: number;

  ratingsNewForDays?: number; // The number of days a rating will show up with a star if it is unread
  ratingOutdatedAfterMonths?: number;
  shiftIncludeLookAheadHours?: number;
  shiftIncludeLookBehindHours?: number;

  newbiesForDays?: number; // NOTE: DUPLICATE! this property is also defined in the server config
  minMinutesBeforeAutoControl?: number;
  minMinutesBeforeAutoControlWhenAway?: number;
  preventUntrainedScheduling?: boolean;
  preventUndertrainedScheduling?: boolean;
  ratingsRecentForDays?: number;

  twoStepBreakSequence?: boolean;
  useBreakTimer?: boolean;
  breakLengthMinutes?: number;
  minShiftLengthForLongBreakHours?: number|false;
  longBreakLengthMinutes?: number;

  // The string tells it which name to display
  // `false` or absent turn off the feature
  useListsWithName?: string|false;

  positionGoodMinimum?: number;
  positionSuperGoodMinimum?: number;
  positionQualifiedMinimum?: number;
  positionUnderqualifiedMinimum?: number;

  progression?: PositionDefinition[];
  disableNicknames?: boolean;

  suggestedLayoutTimes?: number[]; // keep as numbers in hoursFormat for simplicity. the code is already prepared for it anyway
  defaultLayoutTimes?: number[]; // ditto
  layoutGeneration?: LayoutGenerationConfig;

  destinations?: DestinationInfo[];

  guestInactivityBeforeLogoutMinutes?: number;
  permissions?: ClientPermissionConfig;
  leadershipProgression?: LeadershipDefinition[];
}

export interface LeadershipDefinition {
  title: string;
  role: RoleId;
  default?: boolean; // everyone has this permission, so it shouldn't be used when generating the highest position
  private?: boolean; // hide this from being applied on the permissions screen. Used with the `serviceAccount` permission
}
export interface PositionDefinition {
  id: PositionId;
  title: string;
  criterion?: CriteriaId[];
}
