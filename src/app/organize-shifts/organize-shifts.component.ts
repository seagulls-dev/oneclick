import { Component, EventEmitter, OnDestroy, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { combineLatest, from } from 'rxjs';
import { takeUntil, first, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';
import { Day, ShiftsAtMoment } from './day.model';
import { indexOfMax } from '../helpers/snippet';
import { Layout, LayoutCollection } from './layout.model';
import { TimeService, Time } from './time.service';
import { TitleService } from 'src/app/services/title.service';
import { ScreenService, ScreenSizeInfo } from 'src/app/services/screen.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-organize-shifts',
  templateUrl: './organize-shifts.component.html',
  styleUrls: ['./organize-shifts.component.scss']
})
export class OrganizeShiftsComponent implements OnInit, OnDestroy, AfterViewInit {
  day?: Day;
  layout?: Layout;
  shiftsNow?: ShiftsAtMoment;

  public doneAddingShifts: boolean;
  private wasDoneAddingShifts: boolean = true;
  public altPanel: AltPanels = 0;

  private appMenu: boolean;

  @ViewChild('watchHeight') watchHeightContainer: ElementRef;

  private stop$ = new EventEmitter<void>();
  private stopDay$ = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private cd: ChangeDetectorRef,
    private configService: ConfigService,
    private screenService: ScreenService,
    private timeService: TimeService,
    private titleService: TitleService,
  ) { }

  ngOnInit() {
    this.setTitle();
    this.timeService.makeNow();

    // When we load on small screens, automatically hide the side panel
    this.doneAddingShifts = this.screenService.appMenu;

    this.authService.business$
    .pipe(first())
    .subscribe(() => this.timeService.start())

    // Check for changes when the destination or business change
    combineLatest(this.authService.destination$, this.authService.business$)
    .pipe(takeUntil(this.stop$))
    .subscribe(_d => this.cd.markForCheck());
  }
  ngAfterViewInit() {
    // we need to cache the appMenu value so that the component
    // can change with the smaller screens
    this.screenService.resize$
    .pipe(
      takeUntil(this.stop$)
      // ,startWith(null)
      )
    .subscribe((data?: ScreenSizeInfo) => {
      this.watchHeight();
      if(data)
        this.appMenu = data.appMenu;
    });
  }
  ngOnDestroy() {
    this.stop$.next();
    this.stopDay$.next();
  }

  // show and hide the shifts when were dragging in appMenu mode
  @HostListener('dragstart')
  onDragStart() {
    if(!this.appMenu)   return;
    this.wasDoneAddingShifts = this.doneAddingShifts;
    this.doneAddingShifts = true;
  }
  @HostListener('dragend')
  onDragEnd() {
    if(!this.appMenu)   return;
    if(!this.wasDoneAddingShifts)
      this.doneAddingShifts = false;
  }

  private watchHeight(){
    // TODO: accomplish this the 'AngularWay' with sanitizers and other watchers
    const el = this.watchHeightContainer.nativeElement;
    const height = el.clientHeight;
    el.style.setProperty('--full-height', height);
  }

  selectDay(day?: Day): void {
    if(this.day && this.day.id === day.id)
      return; // Tried to 'switch' to same day

    this.day = day;

    if(!day)
      return;

    // cancel the old subscription
    this.stopDay$.next();

    day.load()
    .catch(error => { console.warn(error) } ) // day has already been loaded
    .finally(() => {
      const layouts$ = this.day.layouts$
      .pipe(
        takeUntil(this.stopDay$),
        switchMap(layouts => from(this.checkForDuplicateLayouts(layouts))));

      combineLatest(this.day.shifts$, layouts$, this.timeService.time$)
      .pipe(
        takeUntil(this.stopDay$))
      .subscribe(([shifts, layouts, time]) => {
        if(!this.day)
          throw Error("Day is somehow undefined within OrganizeShifts shifts callback");

        this.layout = this.day.getActiveLayout(layouts, time);
        let targetTime = this.layout ? this.layout.time : time;

        this.shiftsNow = this.day.filterShifts(shifts, layouts, targetTime);

        this.adjustTime(layouts, time);

        this.cd.markForCheck();
      });
    });
  }
  private setTitle(): void {
    this.titleService.set('Organize Shifts');
  }
  private adjustTime(layouts: LayoutCollection, targetTime: Time): void {
    // no need to adjust the time if no layouts exist
    if(!this.layout)
      return;

    if(this.timeService.isToday()){
      const now = TimeService.UTCNow()
      const layoutRightNow = this.day.getActiveLayout(layouts, now);

      // if we are viewing around at different times, then make sure the time is the time of the layout
      // if we the time is before the first layout, also set the time at the first layout
      // ---else--- allow the time to progress naturally through the layout
      // this process keeps the time at the shown time unless the layout is the one that represents the actual time

      // NOTE: this iterative, recursive process relies on the times being rounded to a minute to
      // cancel once it settles down
      if(+targetTime <= +TimeService.extractTime(this.layout.time))
        this.timeService.setTime(this.layout.time);
      else if(this.layout.id === layoutRightNow.id)
        this.timeService.setTime(TimeService.UTCNow());
      else
        this.timeService.setTime(this.layout.time);
    }else
      // if we're looking at another day, the time will always be the time of the layout
      this.timeService.setTime(this.layout.time);
  }
  private checkForDuplicateLayouts(layouts: LayoutCollection): Promise<LayoutCollection> {
    /** Given a collection of layouts,
     *  check if any are defined for the same time.
     *  If so, keep only the one with the most positioned shifts and delete the others
     *  returns once all of the dups have been removed from firebase
     * **/
    let layoutsByTime: { [timeValue: number]: Layout[]; } = {};
    for(let layoutKey in layouts){
      const layout = layouts[layoutKey];
      const timeValue = +layout.time;

      if(!layoutsByTime[timeValue])
        layoutsByTime[timeValue] = []

      layoutsByTime[timeValue].push(layout);
    }

    let networkRequests: Promise<any>[] = [];
    for(let timeValue in layoutsByTime){
      const layoutsAtTime = layoutsByTime[timeValue];
      if(layoutsAtTime.length <= 1)
        continue;

      const positionedShiftsOnLayout: number[] = layoutsAtTime.map(layout => {
        let positionedShifts = 0;

        // don't return a value because that will cause it to stop
        layout.forEachPosition(position => { positionedShifts += position.shifts.length });

        return positionedShifts;
      });
      const greatestIndex = indexOfMax(positionedShiftsOnLayout);

      for(let i=0; i<layoutsAtTime.length; i++){
        if(i === greatestIndex)
          continue;

        networkRequests.push(
          layoutsAtTime[i].delete());
        // delete layouts[layoutsAtTime[i].id];
        // note: this local delete may not be necessary; Firebase may pick up the notice for me and refire correctly without it
      }
    }

    return Promise.all(networkRequests)
      .then(() => layouts);
  }

/*
  march(direction: string): void {
    console.warn(`NOT Marching ${direction}`);
    this.timeService.interact();
  }
*/

  trackByIndex(index: number, _item: any): number {
    return index;
  }

  saveNote(newNote: string): void {
    if(!this.day)  throw Error("[OrganizeShifts] Cannot save note because day is not defined");
    this.day.editNote(newNote);
  }
  createLayout(time: Date): void {
    // Creates a layout and selects it within the service
    if(!this.day)   throw Error('[OrganizeShifts] Could not create layout because day does not exist');

    this.timeService.interact();

    this.day.createLayout(time)
    .then(newLayout => {
      // If the build fails, still go to where the user tried to create a layout
      const targetTime = newLayout ? newLayout.time : time;
      this.timeService.setTime(targetTime);
    });
  }
  resetLayout(layout: Layout): void {
    if(!this.day)  throw Error("[OrganizeShifts] Cannot reset layout because day is not defined");

    this.timeService.interact();
    this.day.resetLayout(layout);
  }
  deleteLayout(layout: Layout): void {
    if(!layout) return;

    this.timeService.interact();
    layout.delete();
  }

  canGrantMooLa(): boolean {
    return this.authService.can('grantMooLa');
  }
  canViewPrompts(): boolean {
    return this.authService.can('viewRatingPrompts')
  }
  canViewLists(): boolean {
    return !!this.configService.getConfig<string|false>("client.useListsWithName", false) &&
      this.authService.can('viewLists');
  }


  bringBackShifts(): void {
    this.doneAddingShifts = !this.doneAddingShifts;
    this.altPanel = AltPanels.shifts;
    this.screenService.processScreenSize();
  }
  finishAltPanelTask(): void {
    this.altPanel = 0;
    this.authService.guestSignOut();
  }
  async viewBills(): Promise<void> {
    if(this.altPanel === AltPanels.moolaBills)
      return this.finishAltPanelTask();

    const canViewBills = await this.authService.canWithRequest('grantMooLa');
    if(!canViewBills)
      return;

    this.altPanel = AltPanels.moolaBills;
    this.doneAddingShifts = false;
  }
  async viewPrompts(): Promise<void> {
    if(this.altPanel === AltPanels.ratingPrompts)
      return this.finishAltPanelTask();

    const canViewPrompts = await this.authService.canWithRequest('viewRatingPrompts');
    if(!canViewPrompts)
      return;

    this.altPanel = AltPanels.ratingPrompts;
    this.doneAddingShifts = false;
  }
  viewLists(): void {

  }
}

// This enum defines which of the alternate side panels is active
enum AltPanels {
  shifts = 0, // Default
  moolaBills = 1,
  ratingPrompts = 2,
  layoutErrors = 3
}
