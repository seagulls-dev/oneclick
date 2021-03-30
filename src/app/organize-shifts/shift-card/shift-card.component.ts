import { Component, Input, Output, EventEmitter, Attribute, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, timer } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { ConfigService } from 'src/app/config/config.service';
import { MooLaService } from 'src/app/services/moo-la.service';
import { ScreenService } from 'src/app/services/screen.service';
import { TimeService, oneMinute, oneHour } from '../time.service';
import { TimePipe, Rules } from 'src/app/pipes/time.pipe';

import { ShiftDragData } from './shift-drag-data.model';
import { Shift } from '../shift.model';
import { Message } from './message.model';
import { BirthdayObject, generateBirthdayObject } from './generate-birthday-message';
import { MooLaBill, isBill } from 'src/app/config/moola-config.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss']
})
export class ShiftCardComponent {
  @Input() scheduledNum: number;
  @Input() shift: Shift;
  @Input() compact?: boolean; // Make things denser: mostly the indicators

  @Output() dragStart = new EventEmitter<Shift>();
  @Output() dragEnd = new EventEmitter<void>();

  public mini: boolean;
  public breakTrackerText?: string; // HTML allowed

  public message?: Message; // TODO: fully implement this messaging system. Right now it is very simplistic
  public birthday?: BirthdayObject;

  private stop$ = new Subject();
  private timerSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private cd: ChangeDetectorRef,
    private configService: ConfigService,
    private mooLaService: MooLaService,
    private router: Router,
    private screenService: ScreenService,
    private timeService: TimeService,
    private timePipe: TimePipe,
    @Attribute('mini') private attrMini: string, // placeholder to convert to boolean
  ) {
    this.mini = this.attrMini === 'true';
  }

  ngOnInit() {
    this.timeService.time$
    .pipe(takeUntil(this.stop$))
    .subscribe(() => this.cd.markForCheck());
  }
  ngOnChanges() {
    this.calculateBreakTracker();
  }

  getDragData(): ShiftDragData {
    return { shift: this.shift };
  }
  handleDragStart(): void {
    if(!this.authService.can("editShifts")) return;
    // Dragging is completely disabled on the DOM, but this check won't hurt;
    // the function should never be called anyway when permission is denied

    this.timeService.interact();

    let oldGoneHome = this.shift.goneHome;
    this.shift.goneHome = false;

    if(oldGoneHome !== this.shift.goneHome)
      this.shift.save();

    this.dragStart.emit(this.shift);
  }
  handleDragEnd(): void {
    this.timeService.interact();
    this.dragEnd.emit();
  }

  tryHandleDrop(data: MooLaBill|any): void {
    if(!isBill(data))
      return;

    this.authService.guestActivity("shift-card: grant moola");

    if(!this.shift.owner)
      return; // The bill was dropped on a shift without an owner

    console.log(`Dropped a $${data.value} Moo-La bill on ${this.shift.owner.name}`);

    // TODO: build an easier system for providing a reason
    // Possibly choose from a list or type the reason beforehand,
    // We would want to cache the typed responses so they could be reused easily
    const forReason = "being awesome!";
    this.mooLaService.grant(data.value, this.shift.owner, forReason)
    /* TODO: build an in-app method to display this success
      .then(success => {
        if(success){
          console.log("Successfully granted money!")
        }else{
          console.log("Grant operation failed.");
        }
      })
    */
      .catch(error => {
        throw new Error(error);
      });
  }

  shiftClick(): void {
    if(!this.authService.can("editShifts")) return;
    this.timeService.interact();

    const twoStepBreaks = this.configService.getConfig<boolean>('client.twoStepBreakSequence', false);
    this.shift.click(this.scheduledNum, twoStepBreaks);

    this.calculateBreakTracker();
  }
  positionClick(_event): void {
    // don't interfer with the breaks and stuff on the iPad
    if(this.screenService.appMenu)  return;

    event.stopPropagation();
    this.router.navigate(['employee', this.shift.ownerId]);
  }

  calculateBreakTracker(): void {
    const shift = this.shift;
    this.breakTrackerText = "";

    // We only want to customize when we're in the *middle* of the break
    if(!shift || !shift.breakNeeded || !(shift.goneOnBreak instanceof Date)){
      this.stopTimer();
      return;
    }

    const useBreakTimer = this.configService.getConfig('client.useBreakTimer', false);
    if(useBreakTimer){
      const shiftHours = (+shift.timeOut - +shift.timeIn) / oneHour;
      const minLongShiftHours = this.configService.getConfig<number>('client.minShiftLengthForLongBreakHours', false);
      const isLongShift = minLongShiftHours && shiftHours >= minLongShiftHours;

      let breakMinutes: number;
      if(isLongShift)
        breakMinutes = this.configService.getConfig<number>('client.longBreakLengthMinutes', 40);
      else
        breakMinutes = this.configService.getConfig<number>('client.breakLengthMinutes', 20);


      const breakStarted = shift.goneOnBreak;
      const breakEnds = TimeService.add(breakStarted, breakMinutes * oneMinute);

      const now = new Date;
      const minutesLeft = Math.round((+breakEnds - +now) / oneMinute);

      const unit = minutesLeft === 1 ? " min" : " mins";
      this.breakTrackerText = "" + minutesLeft + (this.mini ? "" : unit);
    }else{
      const rules: Rules = {
        local: true,
        short: this.mini
      };
      this.breakTrackerText = this.timePipe.transform(shift.goneOnBreak, rules);
    }

    if(useBreakTimer)
      this.startTimer();
    else
      this.stopTimer();
  }
  startTimer(): void {
    if(this.timerSubscription)
      return;

    this.timerSubscription = timer(0, oneMinute)
      .pipe(takeUntil(this.stop$))
      .subscribe(() => {
        this.calculateBreakTracker();
        this.cd.markForCheck();
      })
  }
  stopTimer(): void {
    if(!this.timerSubscription)
      return;

    this.timerSubscription.unsubscribe();
    this.timerSubscription = undefined;
  }

  getClasses(): { [className: string]: boolean } {
    var classes = {
      shift: true,

      mini: this.mini,
      compact: this.compact,
      closing: this.shift.closing,
      training: this.shift.training,
      goneHome: this.shift.goneHome,
      doubleShift: this.shift.doubleShift,
      prep: this.shift.prep,
      isMultiScheduled: this.scheduledNum > 1,

      // more computation required...
      birthday: false,
      notStarted: false,
      alreadyEnded: false,
      empty: false,
      notFullyQualified: false,
      isCurrentEmployee: false,

      break: false,
      hadBreak: false,
      needsBreak: false,
      pendingBreak: false,
      onBreak: false,
    };

    // if the shift does not exist anymore, mark it empty
    // provide indicators if the employees have already left or have not yet begun their shifts
    if(this.shift.timeIn){
      this.timeService.date$.pipe(first()).subscribe(fullTime => {
        let now = fullTime.date;
        if(this.shift.timeIn > now)
          classes.notStarted = true;
        else if(now >= this.shift.timeOut)
          classes.alreadyEnded = true;
      });
    }else
      classes.empty = true;

    // fully qualified and birthdays
    if(this.shift.owner){
      let owner = this.shift.owner;

      if (this.authService.employeeIs(owner)) {
        classes.isCurrentEmployee = true;
      }

      // if they aren't fully qualified for the position, mark them
      if (owner.getHighestPositionIndex({qualified: true}) !==
          owner.getHighestPositionIndex({qualified: false}))
        classes.notFullyQualified = true;

      // This indicator will show for the whole week of their birthday, whenever they have a shift
      classes.birthday = this.timeService.isThisRealWeek(owner.birthday);
      //TODO: consider only evaluating this when the owner changes to save computations.
        // It cannot be only on load because then it will not evaulate correctly when the owner loads later.
        // It could be effectively evaluated only once at least after the owner loads, maybe though a pipe.

      // Build the birthday object to be rendered on the page

      // If the birthday is today, show a birthday cake; else, show the two letter abbreviation of theday
      // if no message exists on the person, add one about the birthday

      // We want to keep the object reference the same for Angular's CD algorithms, until it changes
      // Assume the birthday doesn't change; if it does, it will be caught next time a the shift-card is generated
      if(classes.birthday && !this.birthday){
        this.birthday = generateBirthdayObject(owner.birthday);
      }else if(!classes.birthday)
        this.birthday = undefined;
    }

    // breaks!
    if(this.shift.breakNeeded){
      classes.break = true;

      if(this.shift.goneOnBreak === 'pending')
        classes.pendingBreak = true;
      else if(this.shift.goneOnBreak === true)
        classes.hadBreak = true;
      else if(!this.shift.goneOnBreak)
        classes.needsBreak = true;
      else // It's a date object
        classes.onBreak = true;
    }

    return classes;
  }
}
