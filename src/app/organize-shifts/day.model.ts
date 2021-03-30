import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';
import { Observable } from 'rxjs';

import { EmployeeId } from '../services/employee.model';
import { Shift, ShiftCollection } from './shift.model';
import { ShiftService } from './shift.service';
import { Layout, LayoutCollection } from './layout.model';
import { LayoutService, LayoutConstructionProgress } from './layout.service';
import { ConfigService } from '../config/config.service';
import { TimeService, Time, oneHour } from './time.service';
import { finishConstruction } from '../helpers/snippet';

export class Day {
  private ref: DocumentReference;
  readonly id: string;

  date: Date;
  note: string;

  analyzed: boolean;

  private loaded = false;
  layouts$: Observable<LayoutCollection>;
  shifts$: Observable<ShiftCollection>;

  constructor(
    dayDoc: DocumentSnapshot,
    private shiftService: ShiftService,
    private layoutService: LayoutService,
    private timeService: TimeService,
    private configService: ConfigService
  ) {
    finishConstruction(this, dayDoc);
  }

  async load(): Promise<void> {
    this.loaded = true;

    await Promise.all([
      this.shiftService.start(this.ref),
      this.layoutService.start(this.ref)
    ]);

    // TODO: detect when the data is old and wait before generating more layouts
    // right now, a client sometimes goes comes back on line and then additional layouts can 'cover up' created ones
    var defaultLayoutTimes = this.configService.getConfig<number[]>('client.defaultLayoutTimes', []);
    for (let time of defaultLayoutTimes) {
      let dateTime = TimeService.add(TimeService.fromHoursFormat(time), this.date);
      this.createLayout(dateTime);
    }

    if(!this.shifts$)     this.shifts$ = this.shiftService.get$();
    if(!this.layouts$)    this.layouts$ = this.layoutService.get$();
  }
  stop(): void {
    this.shiftService.stop();
    this.layoutService.stop();

    this.loaded = false;
  }

  private adjustTime(time: Time): Date {
    return TimeService.add(this.date, TimeService.extractTime(time));
  }
  async editNote(newNote: string): Promise<void> {
    if(!this.loaded)  throw Error(`Cannot create layout because the day hasn't been loaded yet`);

    this.timeService.interact();

    this.note = newNote;
    await this.ref.update({ note: newNote });
  }
  createLayout(time: Time): Promise<Layout|false> {
    if(!this.loaded)
      throw Error(`Cannot create layout because the day hasn't been loaded yet`);

    let adjustedTime = this.adjustTime(time);
    let layoutConstructionProgresss: LayoutConstructionProgress = this.layoutService.create(adjustedTime);

    if(layoutConstructionProgresss.error)
      return Promise.resolve(false as false); // { error: layoutConstructionProgresss.error }

    let newLayout = layoutConstructionProgresss.layout,
        allShifts = this.shiftService.getCache(),
        allLayouts = this.layoutService.getCache();

    // find the closest layout that is before time
    let layoutList = layoutConstructionProgresss.sortedExistingLayouts;
    let sourceLayout: Layout;
    for(let i=layoutList.length-1; i>=0; i--)
      if(layoutList[i].time < newLayout.time){
        sourceLayout = layoutList[i];
        break;
      }

    // copy any assigned shifts over
    let adjustedSourceLayout = false;
    if(sourceLayout){
      let sourceShiftsAtMoment = this.filterShifts(allShifts, allLayouts, sourceLayout.time);
      newLayout.copyLayoutFrom(sourceLayout, sourceShiftsAtMoment);

      // if shifts were included (via the lookahead feature) but are no longer because of this layout,
      // remove them from the old layout
      allLayouts[newLayout.id] = newLayout;
      sourceShiftsAtMoment = this.filterShifts(allShifts, allLayouts, sourceLayout.time);
      sourceLayout.forEachPosition(position => {
        for(let i=0; i<position.shifts.length; i++){
          const ownerId = position.shifts[i];
          const shift = sourceShiftsAtMoment.withEmployee(ownerId);

          if(shift.isDummyShift){
            adjustedSourceLayout = true;
            position.shifts.splice(i--, 1);
          }
        }
      });
    }

    // auto-schedule last so it can replace shifts copied over
    let shiftsAtMoment = this.filterShifts(allShifts, allLayouts, newLayout.time);
    newLayout.autoSchedule(shiftsAtMoment);

    // firebase listeners will add it to the system from the root
    let saves = [newLayout.save()];
    if(adjustedSourceLayout)
      saves.push(sourceLayout.save());

    return Promise.all(saves)
      .then(() => newLayout);
  }
  resetLayout(layout: Layout): Promise<Layout> {
    layout.clear();

    let shiftsAtMoment = this.filterShifts(null, null, layout.time);
    layout.autoSchedule(shiftsAtMoment);
    return layout.save();
  }

  getActiveLayout(layouts: LayoutCollection, time: Time): Layout {
    let adjustedTime = this.adjustTime(time),
        layoutsAsArray: Layout[] = [];
    for(let layoutId in layouts)
      layoutsAsArray.push(layouts[layoutId]);

    let activeLayout = layoutsAsArray.sort((a, b) => +b.time - +a.time).find(l => +l.time <= +adjustedTime);
    return activeLayout || layoutsAsArray[layoutsAsArray.length-1];
  }
  filterShifts(shifts: ShiftCollection|null, layouts: LayoutCollection|null, time: Time): ShiftsAtMoment {
    if(!shifts)       shifts = this.shiftService.getCache();
    if(!layouts)      layouts = this.layoutService.getCache();
    if(!time)         throw Error('[Day.filterShifts] Time must be defined to filter shifts');

    let includeAheadHours = this.configService.getConfig<number>('client.shiftIncludeLookAheadHours', 1.25),
        includeBehindHours = this.configService.getConfig<number>('client.shiftIncludeLookBehindHours', 0.5),
        adjustedTime = this.adjustTime(time),
        secondaryTime: Date|false,
        tertiaryTime: Date|false;

    lookAhead: {
      for(let layoutId in layouts){
        const layout = layouts[layoutId];

        const effectiveDiff = ((+layout.time - +adjustedTime) / oneHour - 0.25);
        includeAheadHours = Math.min(
            includeAheadHours,
            effectiveDiff < 0 ? Infinity : effectiveDiff
          );

        if(!includeAheadHours)
          break;
      }

      secondaryTime = includeAheadHours > 0 ? new Date(+adjustedTime + includeAheadHours * oneHour) : false;
    }

    lookBehind: {
      // Only lookBehind to see who is off the clock during the shift
      // i.e. When we're planning out in advance, don't look behind
      if(!this.timeService.isToday()){
        tertiaryTime = false;
        break lookBehind;
      }

      // Don't look behind when there is a major shift change
      // Assume that if a major shift change will occurs, there will be a layout at that time
      // Thus, if we detect that there is a major shift change at the time of this layout, don't look back

      // Define 'major shift change': when a significant number of people begin a shift,
        // and a significant number of people end a shift at the same time
      // Define 'significant number of people': more than x% of the total shifts for the day
      const majorChangeThresholdPercent = 17; // x%
      // Define x%: Though the value at the major changes is usually between 22 and 35%,
        // I have not found it to be above 10% for both peopleOn and peopleOff at other
        // non-major shift times in my sample focus group.
        // This value will be sufficient to detect major changes, even if the shift count is
        // inflated by anomolies like large numbers of people in meetings etc...

      // This process floors the value to the nearest hour to compare
        // I would rather round to the nearest hour, but I suppose it's ok
        // because we're looking for large changes
      const shiftArray: Shift[] = Object.values(shifts);
      const nowHours = time.getUTCHours();
      const peopleOff = shiftArray.reduce((acc, shift): number => {
        return +(shift.timeOut.getUTCHours() === nowHours) + acc;
      }, 0);
      const peopleOn = shiftArray.reduce((acc, shift): number => {
        return +(shift.timeIn.getUTCHours() === nowHours) + acc;
      }, 0);

      const minNumberPeopleChanged = shiftArray.length * majorChangeThresholdPercent / 100;
      const isMajorChange = peopleOff > minNumberPeopleChanged && peopleOn > minNumberPeopleChanged;

      tertiaryTime = isMajorChange ? false : new Date(+adjustedTime - includeBehindHours * oneHour)
    }

    let that = this, filteredShifts = this.shiftService.filterShifts(shifts, adjustedTime, secondaryTime, tertiaryTime);
    return {
      time: adjustedTime,
      shifts: filteredShifts,
      withEmployee: function withEmployee(id: EmployeeId): Shift {
        return that.shiftService.getWithEmployee(id, this.shifts);
      }
    }
  }
}

export interface DayCollection {
  [id: string]: Day;
}
export interface ShiftsAtMoment {
  time: Date;
  shifts: Shift[];
  withEmployee: (id: EmployeeId) => Shift;
}
