import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'logger'
})
export class LoggerPipe implements PipeTransform {
  transform(value: any, _args?: any): void {
    console.log(value);
  }
}
