import { Config } from '../src/app/config/config.model';
import { Employee } from '../src/app/services/employee.model';
import { Collection } from './database.model';
import { DbDestination } from './db-destination.model';
import { DestinationInfo } from '../src/app/services/destination.model';
import { MooLaTransaction } from './db-moola-transaction.model';
import { BusinessPermission } from '../src/app/services/business.model';
import { Omit } from '../src/app/helpers/omit';

export interface DbBusiness {
  employees: Collection<Employee>;
  destinations: Collection<DbDestination>;
  mooLaTransactions: Collection<MooLaTransaction>;

  config: Config; // Note: it's a collection of config stuff

  destinationInfo: DestinationInfo[];
  // The first one will be the default if no other is provided
  // This can also be used to verify if a destinationId is in a given business

  autoUpdate?: BusinessPermission;
  processGroupMe?: BusinessPermission;
  useMooLa?: BusinessPermission;
  useTraining?: BusinessPermission;
  useAdvancedFeatures?: BusinessPermission;

  info: {
    // I put this in the config as well to simplify the server processing script
    name: string; // "CFA Ammon"

    storeNumber: string; // "02789"
    phoneNumber?: string;
    address: string; // "3003 W 25th ..."
  }

  // -------------Various useful statistics
  // Count of employees processed in last processBusiness
  hsEmployees?: number;
  // Last time processBusiness (hotschedules/etc) ran successfully
  lastUpdated: Date;
  // Last time all business config was changed/uploaded to the database
  configUpdated: Date;
  // Number of shifts assigned by a user (resets daily)
  shiftActivityCount: number;
  // Last time a shift was assigned by a user
  lastShiftActivity: Date;
}

// Business should be sent through configs to the database
// (doesn't include some fields which should be handled elsewhere)
export type InputBusiness = Omit<DbBusiness, "employees"|"destinations"|"mooLaTransactions"|"config"|"lastUpdated"|"hsEmployees"|"shiftActivityCount"|"lastShiftActivity">;
