import { Pipe, PipeTransform } from '@angular/core';

import { TimeService } from '../organize-shifts/time.service';

@Pipe({
  name: 'fromHoursFormat'
})
export class FromHoursFormatPipe implements PipeTransform {
  transform(hoursFormat: number, _args?: any): Date {
    return TimeService.fromHoursFormat(hoursFormat);
  }
}
