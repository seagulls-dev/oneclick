import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { ConfigService } from '../../config/config.service';
import { LayoutCollection } from '../layout.model';
import { TimeService, Time, oneHour } from '../time.service';
import { ceil } from 'src/app/helpers/snippet';


@Component({
  selector: 'oc-add-layout',
  templateUrl: './add-layout-modal.component.html',
  styleUrls: ['./add-layout-modal.component.scss']
})
export class AddLayoutModalComponent implements OnChanges {
  @Input() layouts?: LayoutCollection;
  @Output() newLayout = new EventEmitter<Time>();

  activeTime: number;
  suggestedTimes: number[];

  selectedOption: number;
  selectOptions: number[]; // HoursFormat

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.selectOptions = [];
    for(let i = 6; i <= 22.5; i += 0.5)
      this.selectOptions.push(i);
  }
  ngOnChanges() {
    let suggestedTimes = this.configService.getConfig<number[]>('client.suggestedLayoutTimes', []),
        defaultTimes = this.configService.getConfig<number[]>('client.defaultLayoutTimes', []),
        duplicatedTimes = [...suggestedTimes, ...defaultTimes], times = [];

    for(let time of duplicatedTimes)
      if(times.indexOf(time) === -1)
        times.push(time);

    if(this.layouts)
      times = times.filter((time: number): boolean => {
        for(let layoutId in this.layouts)
          if(TimeService.toHoursFormat(this.layouts[layoutId].time) === time)
            return false;
        return true;
      });

    this.suggestedTimes = times.sort((a, b) => a - b);

    this.setActiveTime();
  }

  setActiveTime(): void {
    if(this.suggestedTimes === undefined)  return;

    // use the actual time (not from the time service)
    // to base this decision so it's intuitive for the user
    let nowAsTime = (new Date).getHours();
    this.activeTime = this.suggestedTimes.find(time => time >= nowAsTime) || this.suggestedTimes[0];

    // Select the next half-hour mark automatically
    const now = new Date;
    const hoursFormat = now.getHours() + now.getMinutes() / 60;
    this.selectedOption = ceil(hoursFormat, null, 0.5);
  }

  createAtTime(hoursFormat: number): void {
    let time = TimeService.fromHoursFormat(hoursFormat);
    this.newLayout.emit(time);
  }
}

interface SelectOption {
  value: number; // HoursFormat
  display: string;
}
