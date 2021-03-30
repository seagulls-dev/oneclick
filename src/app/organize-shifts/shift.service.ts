import { Injectable } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';
import { first, mapTo } from 'rxjs/operators';

import { GreedyCacheManager } from '../services/cache-manager-greedy';
import { Shift, EmployeeId, ShiftCollection } from './shift.model';
import { Employee } from '../services/employee.model';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root',
})
export class ShiftService extends GreedyCacheManager<Shift> {
  objConstructor = shiftSnapshot => new Shift(this.employeeService, shiftSnapshot);

  constructor(private employeeService: EmployeeService){
    super();
  }

  start(dayDoc: DocumentReference): Promise<void> {
    this.collection = dayDoc.collection('shifts');
    this.subscribe();

    return this.get$().pipe(first(), mapTo(undefined)).toPromise();
  }

  filterShifts(shifts: ShiftCollection, time: Date, secondaryTime?: Date|false, tertiaryTime?: Date|false): Shift[] {
    if(!shifts) return [];

    var results: Shift[] = [];

    for(let shiftId in shifts){
      let shift = shifts[shiftId];

      // include them if they're scheduled right now, or scheduled at either of the alternate times
      if( !shift.shortShift &&
         ((shift.timeIn <= time && time < shift.timeOut) ||
          (secondaryTime && shift.timeIn <= secondaryTime && secondaryTime < shift.timeOut) ||
          (tertiaryTime && shift.timeIn <= tertiaryTime && tertiaryTime < shift.timeOut)))
        results.push(shift);
    }

    return results;
  }

  private createdShiftCache: { [employeeId: string]: Shift } = {};
  getWithEmployee(employeeOrEmployeeId: Employee | EmployeeId, shifts: Shift[]): Shift {
    const employeeId = typeof employeeOrEmployeeId === 'string' ? employeeOrEmployeeId : employeeOrEmployeeId.id;

    // If a person has a double shift, we want the latest one
    // This is called with shifts already filtered for a specific time
    var latestShift: Shift;
    for(let shift of shifts)
      if(shift.ownerId === employeeId){
        if(!latestShift || +shift.timeOut > +latestShift.timeOut)
          latestShift = shift;
      }

    if(latestShift)
      return latestShift;

    // if no shift is found, create a cached version
    if(!this.createdShiftCache[employeeId])
      this.createdShiftCache[employeeId] = new Shift(this.employeeService, employeeId);

    return this.createdShiftCache[employeeId];
  }
}
