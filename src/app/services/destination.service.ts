import { Injectable } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';

import { ConfigService } from '../config/config.service';
import { DayService } from '../organize-shifts/day.service';
import { Destination } from './destination.model';
import { EmployeeService } from './employee.service';
import { ListService } from '../lists/list.service';
import { PickyCacheManager } from './cache-manager-picky';
import { TimeService } from '../organize-shifts/time.service';

@Injectable({
  providedIn: 'root',
})
export class DestinationService extends PickyCacheManager<Destination> {
  objConstructor = destinationSnapshot => {
    let dayService = new DayService(this.configService, this.employeeService, this.timeService);
    return new Destination(destinationSnapshot, this.configService, dayService, this.listService);
  }

  constructor(
    private configService: ConfigService,
    private employeeService: EmployeeService,
    private listService: ListService,
    private timeService: TimeService
  ){
    super();
  }

  start(businessRef: DocumentReference): void {
    this.collection = businessRef.collection('destinations');
  }
}
