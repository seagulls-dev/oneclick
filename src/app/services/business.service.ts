import { Injectable } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';

import { ConfigService } from '../config/config.service';
import { EmployeeService } from './employee.service';
import { TimeService } from '../organize-shifts/time.service';
import { Business } from './business.model';
import { DestinationService } from './destination.service';
import { PickyCacheManager } from './cache-manager-picky';
import { ListService } from '../lists/list.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessService extends PickyCacheManager<Business> {
  objConstructor = businessSnapshot => {
    let destinationService = new DestinationService(this.configService, this.employeeService, this.listService, this.timeService);
    return new Business(businessSnapshot, this.configService, this.employeeService, destinationService);
  }
  objUpdater = (oldBusiness, businessSnapshot): Business => {
    let oldDestinationService = (oldBusiness as unknown as {destinationService: DestinationService}).destinationService;
    let newBusiness = new Business(businessSnapshot, this.configService, this.employeeService, oldDestinationService);
    return newBusiness;
  }

  constructor(
    private configService: ConfigService,
    private employeeService: EmployeeService,
    private listService: ListService,
    private timeService: TimeService
  ){
    super();
  }

  start(environmentRef: DocumentReference): void {
    this.collection = environmentRef.collection('businesses');
  }
}
