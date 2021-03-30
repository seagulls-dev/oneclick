import { GroupId } from '../../../server/GroupMe';

export interface ServerConfig {
  schedulesToTranscript?: number[];
  shifts?: {
    minimumHoursForBreak?: number,
    minimumShiftHours?: number,
    storeClosesAt?: string; // "h:mm a",
    shiftLeaderJobId?: number,
    prepJobId?: number,
    trainingScheduleId?: number,
    neverShort?: { // shifts matching any of these criteria will never be excluded for being short
      jobIds?: number[],
      scheduleIds?: number[],
    },
    keepPositionHistoryDays?: number,
  },
  HotSchedules?: {
    adminUsername: string,
    adminPassword: string,
    searchDaysWithoutShifts?: number, // technical: days to continue searching without finding days
    beginSyncingBackDays?: number, // technical: days in the past to sync
  },
  GroupMe?: {
    apiToken?: string,
    mainGroupId?: GroupId,

    // not implemented yet
    subGroupId?: GroupId, // for the destinations; TODO: decide when someone should be in the group
  },

  newbiesForDays?: number; // NOTE: DUPLICATE! this property is also defined in the client config
  storeEmployeeId?: string; // "Da Cowz" account which impersonates the store
  storeEmployeeEmail?: string; // Email to link to the store employee for logging in
  positionRequestValidForDays?: number,
  positionRecommendationValidForDays?: number,
}
