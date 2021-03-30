import { Component, Input } from '@angular/core';

import { Employee } from '../../../services/employee.model';
// import { isValidUrl } from 'src/app/helpers/snippet';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'oc-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent {
  @Input() employee: Employee;

  constructor(public photoService: PhotoService) { }

  /*
  // keeping the code in case I need to do this again
  changeProfilePhoto(employee: Employee): Promise<void> {
    const response = prompt(`What is the new Profile Url for ${employee.name}`);
    if(!response)
      return;

    if(!isValidUrl(response))
      return;

    employee.profileUrl = response;
    console.log(`Updated profile URL for ${employee.name}`, employee);
    return employee.save();
  }
  */
}
