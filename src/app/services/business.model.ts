import { DocumentReference, DocumentSnapshot, Timestamp } from '@firebase/firestore-types';
import firebase from '@firebase/app';
import { ReplaySubject } from 'rxjs';

import { Destination, DestinationCollection, DestinationInfo } from './destination.model';
import { DestinationService } from './destination.service';
import { Employee, EmployeeCollection, EmployeeId } from './employee.model';
import { EmployeeService } from './employee.service';
import { ConfigService } from '../config/config.service';
import { PreppingTransaction, GroupMooLaTransaction } from '../../../database/db-moola-transaction.model';
import { finishConstruction, cleanEmail } from '../helpers/snippet';
import { BusinessCreatedPendingAcccount } from '../../../database/pending-account.model';
import { EmployeeIdentifier } from '../../../database/db-user.model';

export class Business {
  private ref: DocumentReference;
  readonly id: BusinessId;

  // Permissions and restriction
  // IMPORTANT: these keys must not overlap with permissions defined in server/config/.../client-permissions.ts
  // Otherwise, they will be overshadowed in most use cases

  // Note: these keys are kept seperately as a UnionType down below
  // TODO: use some kind of transform to map the union type into BusinessPermission on the Business
  // class to eliminate redudancy
  autoUpdate?: BusinessPermission;
  processGroupMe?: BusinessPermission;
  useMooLa?: BusinessPermission;
  useTraining?: BusinessPermission;
  useAdvancedFeatures?: BusinessPermission;

  hsEmployees?: number;
  lastUpdated: Date;
  configUpdated: Date;
  shiftActivityCount?: number;
  lastShiftActivity?: Date;

  info: {
    name: string; // "CFA Ammon"
    address: string;
    storeNumber: string; // "02789"
    phoneNumber?: string;
  };

  destinationInfo: DestinationInfo[];

  employee$(id: string): ReplaySubject<Employee|undefined> {
    return this.employeeService.get$(id);
  }
  employees$(): ReplaySubject<EmployeeCollection> {
    return this.employeeService.getAll$();
  }
  destination$(id: string): ReplaySubject<Destination> {
    return this.destinationService.get$(id);
  }
  destinations$(): ReplaySubject<DestinationCollection> {
    return this.destinationService.getAll$();
  }
  employeeWithPin(pin: number): Promise<Employee|undefined> {
    return this.employeeService.getWithPin(pin);
  }

  constructor(
    businessDoc: DocumentSnapshot,
    private configService: ConfigService,
    private employeeService: EmployeeService,
    private destinationService: DestinationService
  ){
    finishConstruction(this, businessDoc);
  }

  async load(): Promise<Business> {
    await Promise.all([
      this.configService.init('business', this.ref),
      this.employeeService.start(this.ref),
      this.destinationService.start(this.ref)
    ]);
    return this;
  }
  unload(): void {
    // Assume that we don't want to rapidly switch between businesses
    // stop all of the listeners and delete the data
    this.configService.deinit('business');
    this.employeeService.stop(true);
    this.destinationService.stop(true);
  }

  newShiftActivity() {
    const update = {
      lastShiftActivity: firebase.firestore.FieldValue.serverTimestamp(),
      shiftActivityCount: firebase.firestore.FieldValue.increment(1) as any,
    };

    // If different day (UTC time), reset count to 1
    if (this.lastShiftActivity) {
      const now = new Date();
      if (this.lastShiftActivity.getUTCDate() !== now.getUTCDate() ||
          this.lastShiftActivity.getUTCMonth() !== now.getUTCMonth() ||
          this.lastShiftActivity.getUTCFullYear() !== now.getUTCFullYear()) {
        update.shiftActivityCount = 1;
      }
    }

    this.ref.update(update);
  }

  nextDestination(currentDestination?: Destination): DestinationInfo|undefined {
    if(!currentDestination)
      return;

    const destinations = this.configService.getConfig<DestinationInfo[]>('client.destinations', []);

    // we don't even have multiple destinations to switch between
    if(destinations.length < 2)
      return;

    // TODO: consider providing a list to choose from when there are several destinations (> 2)

    const currentIndex = destinations.findIndex(d => d.id === currentDestination.id);
    const nextIndex = (currentIndex + 1) % destinations.length;

    return destinations[nextIndex];
  }

  saveMooLaTransaction(data: PreppingTransaction): Promise<void> {
    const newTransactionRef = this.ref.collection('mooLaTransactions').doc();

    // Prepare the employees for easier searching/filtering
    let employees: EmployeeId[] = [];

    // Look for any employeeId's under any of these properties and add
    // them to the employees list for easier searching
    for(let prop of ['by', 'from', 'to'])
      if(data[prop]){
        if(data[prop].id)
          employees.push(data[prop].id)
        else if(data[prop].employee && data[prop].employee.id)
          employees.push(data[prop].employee.id)
      }

    // Do the same with anyone in a group
    if((<GroupMooLaTransaction>data).toGroup && (<GroupMooLaTransaction>data).toGroup.length)
      for(let basicInfo of (<GroupMooLaTransaction>data).toGroup)
        employees.push(basicInfo.id);

    let newTransaction = Object.assign(data, {
      timestamp: firebase.firestore.FieldValue.serverTimestamp() as Timestamp,
      employees,
    });

    return newTransactionRef.set(newTransaction);
  }

  linkEmployeeToEmail(employee: Employee, emailAddress: string): Promise<boolean> {
    // WARNING: this could be a security concern because of the way the business
    // operates on data outside of itself and manages email addresses
    // It would be much better to actually do this logic in the server

    const email = cleanEmail(emailAddress);

    if(!email){
      console.log(`Did not link email address ${emailAddress} to ${employee.name} because it couldn't be prepared.`);
      return Promise.resolve(false);
    }

    // Consider: looking for existing pending accounts to link
    // This shouldn't be necessary because the clients always check for new pending accounts when they login

    const pendingAccountsRef = this.ref.parent.parent.collection('pendingAccounts');
    const pendingAccount: BusinessCreatedPendingAcccount = {
      createdBy: 'business',
      created: new Date,
      email,

      employeeId: employee.id,
      businessId: this.id,

      // Assume that the employee wants to default to the manager's current destination
      // when he clicks the button
      // destinationId: ... // TODO: provide get this information (I forgot how)
    }

    return pendingAccountsRef.doc().set(pendingAccount)
      .then(() => {
        console.log(`Successfully created a pending account ref for ${employee.name} at ${email}`);
        return true;
      })
      .catch(error => {
        throw Error(`[business.model:linkEmployeeToEmail] Could not create pending account for ${employee.name} at ${email}`);
      });
  }
};

export type BusinessId = string;
export interface BusinessCollection {
  [businessId: string]: Business;
}

export interface EmployeeBusiness {
  eid: EmployeeIdentifier;
  business: Business;
}

/**
 * autoUpdate - (server-side) process HotSchedules data
 * processGroupMe - GroupMe used in this business (affects some server-side functions and app-side)
 * useMooLa - everything to do with the moola virtual currency
 * useTraining - viewing the training dashboard, viewing ratings and rating prompts
 * useAdvancedFeatures - Mostly just editing shifts. For now, too important to ever set this to false.
 **/
export type BusinessPermissionId = "autoUpdate"|"processGroupMe"|"useMooLa"|"useTraining"|"useAdvancedFeatures";
export type BusinessPermission = boolean|Date; // The date indicates the time that the permission ends
