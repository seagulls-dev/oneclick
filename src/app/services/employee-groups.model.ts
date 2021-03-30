export interface CalculatedEmployeeGroups {
  leader?: boolean; // Is above a regular team member
  newbie?: boolean; // has only been hired for a short time; TODO: also count when recently restored from archives
  [destinationTag: string]: boolean; // ex: destination-(destinationId): true

  // Algorithmically generated groups:
  trainingHint?: boolean; // Umbrella group to indicate that any of the following apply
  positiveLastRating?: boolean; // Their highest position is highly rated, and there is a higher position without a rating
  placementWithoutRating?: boolean; // They have been placed in positions several times where they have no rating
  notGroupMeConnected?: boolean; // Indicates that they are not linked to a GroupMe member, and therefore not in the main group chat
  /** Other ideas that may belong somewhere else:
   *
   * an employee has been placed in the same role for several consequetive shifts
   * an employee has not done a job that they are good at in awhile
   * employees that worked on the shift with you
   *  \-->  this could be easily approximated by daily keeping track of the last shift someone worked
   *        in the server code and then comparing that in the app.
   *  -- and don't have ratings
   *
   * */

  // manually managed groups
  crossTraining?: boolean;
  // [noDestinationTag: string]: boolean; // ex: no-destination-(destinationId): true
    // these flags prevent the employee from being added to a destination under some circumstances
  // I wish that would work, but I'll just have to know that it exists
}

export type GroupTag = "leader"|"newbie"|string;
