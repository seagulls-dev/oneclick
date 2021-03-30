import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';
import { Observable } from 'rxjs';

import { Employee, EmployeeId as EmployeeId_original } from '../services/employee.model';
import { EmployeeService } from '../services/employee.service';
import { finishConstruction } from '../helpers/snippet';

export class Shift {
  private ref?: DocumentReference;
  readonly id: string;

  isDummyShift?: boolean;

  breakNeeded: boolean;
  closing: boolean;
  prep: boolean;
  training: boolean;
  shortShift: boolean;
  shiftLeader: boolean;

  job: string;
  ownerId: EmployeeId;
  owner?: Employee;
  owner$: Observable<Employee>;

  timeIn: Date;
  timeOut: Date;

  doubleShift: boolean;
  goneOnBreak: GoneOnBreak;
  goneHome: boolean;

  constructor(employeeService: EmployeeService, employeeShiftDoc: DocumentSnapshot)
  constructor(employeeService: EmployeeService, employeeId: string)
  constructor(employeeService: EmployeeService, shiftDocOrEmployeeId: DocumentSnapshot | string){
    if(typeof shiftDocOrEmployeeId === 'string'){
      let employeeId = shiftDocOrEmployeeId;

      // dummy shift
      this.isDummyShift = true;
      this.ownerId = employeeId;
    }else{
      let shiftDoc = shiftDocOrEmployeeId;

      finishConstruction(this, shiftDoc);
    }

    this.owner$ = employeeService.get$(this.ownerId);

    // This makes the observable hot, and stores it for easy batch operations
    // TODO: This subscription is never cancelled. It could be the cause of
    // memory leaks and performance issues
    this.owner$.subscribe(employee => this.owner = employee);
  }

  save(): Promise<void> {
    if(!this.ref)  return;

    return this.ref.update({
      // TODO: maybe serialize and update the entire shift... ??
      goneOnBreak: this.goneOnBreak,
      goneHome: this.goneHome,
    })
    .then(() => {})
    .catch(console.error);
  }
  click(scheduledNum: number, twoStepBreaks?: boolean): Promise<void> {
    // If the shift is a faked, cached shift; do nothing
    if(!this.ref)
      return Promise.resolve();

    // If they are on break, finish the break
    // Else if the shift is scheduled, advance their break state;
    // otherwise, toggle their goneHome
    var shouldSave = true;
    if (this.goneOnBreak instanceof Date)
      this.goneOnBreak = true;
    else if(scheduledNum){
      if(this.breakNeeded){
        switch(this.goneOnBreak){
          case undefined:
          case false:
            this.goneOnBreak = 'pending';
            break;
          case 'pending':
            this.goneOnBreak = twoStepBreaks ? true : new Date;
          break;
          case true:
            this.goneOnBreak = false;
            break;
          default:
            this.goneOnBreak = true;
        }
      }else
        shouldSave = false;
    }else{
      this.goneHome = !this.goneHome;
    }

    return shouldSave ? this.save() : Promise.resolve();
  }
}

export type ShiftCollection = { [shiftId: string]: Shift }
export type EmployeeId = EmployeeId_original;

/** Notes:
 * This field starts as false or undefined
 * If the shift needs a break, the first time it is clicked, it is set to 'pending'.
 * The next click sets it to the current time.
 * This is used to either show a timer or just display a timestamp,
 * based on the config settings. When it is clicked again, it is set to true, indicating
 * everything is finished with the break.
 * */
export type GoneOnBreak = Date|boolean|'pending';
