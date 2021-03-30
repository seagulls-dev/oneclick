import { Injectable } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';

import { PickyCacheManager } from './cache-manager-picky';
import { Employee } from './employee.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends PickyCacheManager<Employee> {
  objConstructor = employeeSnapshot => new Employee(employeeSnapshot, this.configService);
  objUpdater = (oldEmployee, employeeSnapshot): Employee => {
    let newEmployee = new Employee(employeeSnapshot, this.configService);
    newEmployee.history = oldEmployee.history;
    newEmployee.parties = oldEmployee.parties;
    return newEmployee;
  }

  constructor(private configService: ConfigService){
    super();
  }

  start(businessDoc: DocumentReference): void {
    this.collection = businessDoc.collection('employees');
    this.query = this.collection.where('archived', '==', false);
  }

  getWithPin(pin: number): Promise<Employee|undefined> {
    // TODO: consider putting this logic deeper in the service where
    // database listeners would keep it up to date...
    return this.collection.where('pin', '==', pin).get().then(querySnapshot => {
      if(querySnapshot.empty)
        return;

      if(querySnapshot.size > 1){
        const names = querySnapshot.docs.map(d => d.get('name'));
        throw Error(`${querySnapshot.size} employees have the same PIN (${pin}): ${names.join(', ')}`);
      }

      const employeeDoc = querySnapshot.docs[0];
      const employee = this.objConstructor(employeeDoc);
      return employee;
    });
  }
}
