import { Component, OnChanges, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';

import { Day, DayCollection } from '../day.model';
import { WeekGroup, WeekGroupLabel } from './week-group.model';
import { TimeService, Day as DayDate } from '../time.service';

@Component({
  selector: 'oc-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss']
})
export class DaySelectorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() days: DayCollection;
  @Output() dayChange = new EventEmitter<Day|undefined>();

  weekGroups: WeekGroup[];
  selectedDay: Day;
  actualDate: DayDate;

  private stop$ = new EventEmitter<void>();

  constructor(private timeService: TimeService) { }

  ngOnInit() {
    this.timeService.day$
    .pipe(takeUntil(this.stop$))
    .subscribe((day: DayDate) => {
      this.setDefaultDay(day);
    });
  }
  ngOnDestroy() {
    this.stop$.emit();
  }
  ngOnChanges(_changes) {
    this.weekGroups = [];

    this.actualDate = TimeService.extractUTCDay(new Date);

    for(let dayId in this.days){
      let day = this.days[dayId];
      let weekGroupLabel: WeekGroupLabel = this.getWeekGroupLabel(day);

      for(let weekGroupIndex = 0; weekGroupIndex <= this.weekGroups.length; weekGroupIndex++){
        let weekGroup = this.weekGroups[weekGroupIndex];

        if(!weekGroup || weekGroupLabel.weeksOut < weekGroup.sortValue){
          this.weekGroups.splice(weekGroupIndex, 0, {
            title: weekGroupLabel.value,
            sortValue: weekGroupLabel.weeksOut,
            days: [day],
          });
          break;
        }else if(weekGroupLabel.weeksOut === weekGroup.sortValue){
          weekGroup.days.push(day);
          break;
        }
      }
    }

    for(let weekGroup of this.weekGroups)
      weekGroup.days.sort((a, b) => +a.date - +b.date);

    this.timeService.day$.pipe(first()).subscribe(day => {
      this.setDefaultDay(day);
    });
  }

  selectDay(day: Day): void {
    if(!day)  return;

    this.timeService.interact();
    this.timeService.setDay(day.date);

    this.selectedDay = day;
    this.dayChange.emit(day);
  }
  setDefaultDay(date: Date): void {
    let days = [] as Day[];
    for(let dayId in this.days)
      days.push(this.days[dayId]);

    // sort ascending
    days.sort((a, b) => +a.date - +b.date);

    // pick the first day that matches is is after the match,
    // this will send you to monday, when it's sunday
    for(let day of days)
      if(+day.date >= +date)
        return this.selectDay(day);

    // Since no day was the right one, we chose the last one
    this.selectDay(days[days.length-1]);
  }

  getWeekGroupLabel(day: Day): WeekGroupLabel {
    let weeksOut = TimeService.getAbsoluteWeek(day.date) - TimeService.getAbsoluteWeek(TimeService.UTCNow());

    var value: string;
    if(weeksOut < -2)                     value = "Far in the past";
    else if(weeksOut === -2)              value = "Week before last";
    else if(weeksOut === -1)              value = "Last week";
    else if(weeksOut === 0)               value = "This week";
    else if(weeksOut === 1)               value = "Next week";
    else if(weeksOut === 2)               value = "Two weeks out";
    else if(weeksOut > 2)                 value = "Far in the future";
    else                                  value = "Unrecognized Week";

    return {
      weeksOut: weeksOut,
      value: value,
    }
  }
}
