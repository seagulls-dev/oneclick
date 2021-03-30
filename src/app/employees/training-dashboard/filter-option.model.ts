import { CalculatedEmployeeGroups } from 'src/app/services/employee-groups.model';
import { RoleId } from 'src/app/services/employee.model';

import { SortOption } from './sort-option.model';
import { DestinationId } from 'src/app/services/destination.model';

export interface FilterOption {
  groups?: FilterGroups;
  roles?: FilterRoles; // These roles will always be interpreted strictly
  search?: FilterSearch; // Searching by string disables any 'alwaysInclude' flags

  // Will be intrepreted as must include, but undecided newbies will show through
  destination?: DestinationId;

  mooLa?: FilterModes;
  // This will filter people with MooLa or MooLa Budget

  // When true, the training-dashboard will cut the results short after they are sorted
  // This should be used to improve performance; TODO: paginate the rest of the data...
  truncateResults?: boolean;

  showData?: {
    // These flags indicate which groups of columns to show
    // True means show, false means hide.
    // If unset, the display mode will not change
    mooLa?: boolean; // mooLa, mooLaBudget, mooLaDisbursed etc...
    training?: boolean; // lastUpdated, position scores etc...

    defaultSort?: SortOption; // This will be the initial sort, but they can obviously change it
      // if unset, the sort will not change
  }

  // A soft sort merely includes an identifier on the ExtraEmployee
  // while preserving the record in the array. This allows it to be hidden
  // via css on the model for performance reasons
  soft?: boolean;
}

export type FilterRoles = {[k in RoleId]?: FilterModes }
export type FilterGroupKeys = keyof CalculatedEmployeeGroups;
export type FilterGroups = {[k in keyof CalculatedEmployeeGroups]?: FilterModes }
export enum FilterModes {
  noImportance = 0,
  cannotInclude = 1,
  mustInclude = 2,
  alwaysInclude = 3 // This takes precendence over other filters that may make a record disappear
}

export type FilterSearch = {
  text: string;
}
