import { Injectable } from '@angular/core';
import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';
import { first, mapTo } from 'rxjs/operators';

import { GreedyCacheManager } from '../services/cache-manager-greedy';
import { Day } from './day.model';
import { ShiftService } from './shift.service';
import { LayoutService } from './layout.service';
import { ConfigService } from '../config/config.service';
import { EmployeeService } from '../services/employee.service';
import { TimeService, oneDay } from './time.service';

@Injectable({
  providedIn: 'root',
})
export class DayService extends GreedyCacheManager<Day> {
  objConstructor = (daySnapshot: DocumentSnapshot): Day => {
    let shiftService = new ShiftService(this.employeeService);
    let layoutService = new LayoutService(this.configService, shiftService);

    return new Day(daySnapshot, shiftService, layoutService, this.timeService, this.configService);
  }
  objUpdater = (existingDay: Day, daySnapshot: DocumentSnapshot): Day => {
    // Recycle the services, but build a new object for Angular's Change Detection
    const oldShiftService = (<any>existingDay).shiftService;
    const oldLayoutService = (<any>existingDay).layoutService;

    return new Day(daySnapshot, oldShiftService, oldLayoutService, this.timeService, this.configService);
  }

  constructor(
    private configService: ConfigService,
    private employeeService: EmployeeService,
    private timeService: TimeService
  ) {
    super();
  }

  start(destinationRef: DocumentReference): Promise<void> {
    this.collection = destinationRef.collection('days');
    const viewHistoryDays = this.configService.getConfig<number>('client.viewLayoutHistoryDays', 7);
    const minDownloadDate = new Date(+(new Date) - viewHistoryDays * oneDay);
    this.query = this.collection.where('date', '>=', minDownloadDate);

    this.subscribe();

    return this.get$().pipe(first(), mapTo(undefined)).toPromise();
  }
}
