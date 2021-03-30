import { Component, OnChanges, Input, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { takeUntil, first, map } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { Employee } from '../../services/employee.model';
import { ScreenService, ScreenSizeInfo } from 'src/app/services/screen.service';
import { TimeService, FullTime } from '../time.service';
import { toArray, round } from 'src/app/helpers/snippet';

import { Shift } from '../shift.model';
import sortShifts from './sort-shifts';
import { WorkerMap, Layout } from '../layout.model';
import { PositionId } from 'src/app/config/layout-generation-config.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() shifts: Shift[];
  @Input() workers?: WorkerMap;
  @Input() layout?: Layout;
  @Output() dividerClick = new EventEmitter<void>();

  filteredShiftsScheduled: Shift[];
  filteredShiftsUnscheduled: Shift[];

  stats?: ShiftStats;

  compact?: boolean; // True if we should densly show the shift cards

  private stop$ = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private screenService: ScreenService,
    private timeService: TimeService,
  ) { }

  ngOnInit() {
    this.timeService.date$
    .pipe(takeUntil(this.stop$))
    .subscribe((_fullTime: FullTime) => {
      this.filterShifts();
    });

    this.screenService.resize$
    .pipe(takeUntil(this.stop$))
    .subscribe((data: ScreenSizeInfo) => {
      this.compact = data.onePanel;
      this.cd.markForCheck();
    });
  }
  ngOnChanges() {
    if(!this.workers)
      this.workers = {};

    let ownerObservables: Observable<Employee>[] = [];
    for(let shiftId in this.shifts)
      ownerObservables.push(this.shifts[shiftId].owner$);

    if(ownerObservables.length)
      combineLatest.apply(null, ownerObservables)
      .pipe(first())
      .subscribe(() => {
        this.filterShifts();

        // TODO: this is kind of a fake way of ensuring
        // that the shifts component is resized AFTER the
        // data loads. Another solution might be cleaner...
        this.screenService.processScreenSize();
      });

    this.filterShifts();
  }
  ngOnDestroy() {
    this.stop$.emit();
  }

  filterShifts(): void {
    var scheduled: Shift[] = [],
        unscheduled: Shift[] = [],
        shifts = this.shifts || [],
        workers = this.layout && this.layout.workers || {};

    // Split them into separate arrays for scheduled/unscheduled
    for(let shift of shifts){
      if(workers[shift.ownerId])
        scheduled.push(shift);
      else
        unscheduled.push(shift);
    }

    // if all of the unscheduled shifts have gone home,
    // send them all to the bottom of the scheduled list
    moveGoneHomeShifts: {
      if(!unscheduled.length)
        break moveGoneHomeShifts;

      for(let shift of unscheduled)
        if(!shift.goneHome)
          break moveGoneHomeShifts;

      scheduled = scheduled.concat(unscheduled);
      unscheduled = [];
    }

    // This pipe will evaluate synchronously because the data is already available
    this.timeService.date$
      .pipe(
        first(),
        map(fullTime => fullTime.date))
      .subscribe(now => {
        this.filteredShiftsScheduled = sortShifts(true, scheduled, now);
        this.filteredShiftsUnscheduled = sortShifts(false, unscheduled, now);
        this.stats = this.getStats(this.filteredShiftsScheduled, this.filteredShiftsUnscheduled);

        this.cd.markForCheck();
      })

  }
  private getStats(scheduledShifts: Shift[], unscheduledShifts: Shift[]): ShiftStats|undefined {
    // We need to at least have 1 shift and arrays defined for both params
    if(!scheduledShifts || !unscheduledShifts ||
      (!scheduledShifts.length && !unscheduledShifts.length))
        return;

    var stats: ShiftStats = {
      shifts: scheduledShifts.length + unscheduledShifts.length,
      workers: 0,

      // More calculation required
      strength: 0, // This number is reserved as a special feature
      leaders: 0,
      newbies: 0
    };

    if(this.layout){
      let totalScore = 0, numScores = 0;
      const allShifts = [...scheduledShifts, ...unscheduledShifts];

      // The Strength is the average score of each employee's rating for the position
      // which they are currently working.

      // Assume that every working position is assigned to some kind of training position
      // If it doesn't, process it anyway and give the workers the default rating
      // This means that Shift Leaders etc will get a free 5, but that's ok. SL's are great everywhere
      // It also means misconfigured layouts will behave strangely in this algorithm

      // If an employee is scheduled in several positions, the highest value is taken
      // If an employee doesn't have a rating in the position
        // Leaders default to 5 -- CFA master
        // Everyone else default to 3 -- qualified
      // If a shift doesn't have an owner, it probably has been traded; don't count it towards the average

      // Generate a map of all the employeeIds with every different positionrequirement they are working
      let employees: { [employeeId: string]: PositionId[] } = {};
      this.layout.forEachPosition(p => {
        if(!p.shifts || !p.shifts.length)
          return;

        const targetPositionId = toArray(p.requireTraining || "")[0];

        for(let ownerId of p.shifts){
          if(!employees[ownerId])
            employees[ownerId] = [targetPositionId];
          else if(employees[ownerId].indexOf(targetPositionId) === -1)
            employees[ownerId].push(targetPositionId);
        }
      })

      // Choose to take the average based employees best location, if placed several times
      for(let employeeId in employees){
        // A shift should contain an owner object filled in
        const shift = allShifts.find(shift => shift.ownerId === employeeId);
        const owner = shift && shift.owner;
        if(!owner)
          continue;

        stats.workers++;
        if(owner.groups.leader)
          stats.leaders++;
        if(owner.groups.newbie)
          stats.newbies++;

        let maxScore = 0;
        const defaultScore = owner.groups.leader ? 5 : 3;

        for(let positionId of employees[employeeId]){
          let score = owner.scores[positionId] && owner.scores[positionId].rating || defaultScore;
          maxScore = Math.max(maxScore, score);
        }

        if(maxScore){
          totalScore += maxScore;
          numScores++;
        }
      }

      if(this.authService.businessCan('useAdvancedFeatures'))
        stats.strength = numScores ? round(totalScore / numScores, 1) : 0;
    }

    return stats;
  }

  getScheduledNum(shift: Shift): number {
    return this.layout && this.layout.workers && this.layout.workers[shift.ownerId] || 0;
  }
  trackByShift(_index: number, shift: Shift): string {
    return shift.id;
  }
}

export interface ShiftStats {
  shifts: number;
  workers: number;

  strength: number;
  leaders: number;
  newbies: number;
}
