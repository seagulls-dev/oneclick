import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, filter, switchMap, map, tap, first, take } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { ConfigService } from 'src/app/config/config.service';
import { Destination } from 'src/app/services/destination.model';
import { EmployeeCollection, Employee } from 'src/app/services/employee.model';
import { MooLaService } from 'src/app/services/moo-la.service';
import { PhotoService } from 'src/app/services/photo.service';
import { TitleService } from 'src/app/services/title.service';
import { TimeService, oneDay } from 'src/app/organize-shifts/time.service';

import { FilterOption, FilterModes } from './filter-option.model';
import { SortOption } from './sort-option.model';
import { ExtraEmployee, EmployeeContainer } from './extra-employee.model';
import { filterEmployees } from './filter-employees';
import { sortEmployees } from './sort-employees';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-training-dashboard',
  templateUrl: './training-dashboard.component.html',
  styleUrls: ['./training-dashboard.component.scss']
})
export class TrainingDashboardComponent implements OnInit, OnDestroy {
  stop$ = new EventEmitter<void>();

  static TRUNCATE_TO_LENGTH = 150; // TODO: raising this limit mitigates the ...
    // issue of truncating because it will likely never be at a significant
    // place. However, there still is an issue: when records are truncated, there
    // is no way to see them. Develop pagination or expanding lists to solve.
  public isLoading = true;
  public filterResults?: FilterResults;

  // Hide all of these until we're told what to do to eliminate flashes
  public showMooLaInfo = false;
  public showTrainingInfo = false;
  public showLastUpdatedInfo = false;

  private sortOption$ = new BehaviorSubject<SortOption>({ id:'name' });
  public filterOption$ = new BehaviorSubject<FilterOption>({});
  public employees$: Observable<ExtraEmployee[]>;
  public sampleEmployee$: Observable<ExtraEmployee>;

  // Following this answer: https://stackoverflow.com/a/51074896/2844859
  private reset$ = new EventEmitter();

  private businessCanProcessGroupMe?: boolean;
  private unreadUpdatesCache?: { employeeId: string, maxUpdateTime: Date };

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private cd: ChangeDetectorRef,
    public mooLaService: MooLaService,
    public photoService: PhotoService,
    private titleService: TitleService,
  ) { }

  ngOnInit() {
    this.setTitle();

    const employees$: Observable<EmployeeCollection> = this.authService.business$.pipe(
      filter(business => !!business),
      switchMap(business => business.employees$()));
    const destination$: Observable<Destination> = this.authService.destination$.pipe(
      tap(_destination => {
        this.resetFilter();
        // this.resetSort(); // The filter option controls the default sorting as well

        // Whenever the business changes, the destination will also change
        this.businessCanProcessGroupMe = this.authService.businessCan('processGroupMe');
        this.authService.guestActivity("training-dashboard:change destination");
      }))

    // Hard filter out the people not in this destination to decrease our record list,
    // then soft filter (css hide) the rest of the filters for performance and rendering reasons
    // TODO: provide a way to still see all people, if needed
    const extraEmployees$: Observable<ExtraEmployee[]> = combineLatest(destination$, employees$).pipe(
      map(([destination, employees]) => {
        // If the destination hasn't loaded, we can't know which employee to include
        if(!destination)
          return [];

        // console.log(`Mapping ${Object.keys(employees).length} employees into ExtraEmployees`);
        let allEmployees: EmployeeContainer[] = [];
        for(let employeeId in employees){
          const employee = employees[employeeId];

          allEmployees.push({ employee });
        }

        let rootFilter: FilterOption = { groups: {}, roles: {} };

        // Never include serviceAcounts because they just clutter up the space
        // Assume that the store is using a ServiceAccount and
        // that none of the regular employees have the ServiceAccount permission
        // I sometimes break the rule with my account, but that's ok
        rootFilter.roles.serviceAccount = FilterModes.cannotInclude;

        const destinationEmployees = filterEmployees(allEmployees, rootFilter);
        const extraEmployees: ExtraEmployee[] = destinationEmployees.map((record: EmployeeContainer): ExtraEmployee => {
          record.scoresList = record.employee.getScoresList();
          record.lastUpdatedString = TimeService.timeFromNow(record.employee.lastUpdated, true);
          return record as ExtraEmployee;
        });

        return extraEmployees;
      }));

    // TODO: write a more beautiful constuction that doesn't repeat so much
    const filterOption$ = this.filterOption$.pipe(
      tap(option => {
        if(option.showData){
          if(option.showData.mooLa !== undefined)
            this.showMooLaInfo = option.showData.mooLa
          if(option.showData.training !== undefined)
            this.showTrainingInfo = option.showData.training;
          if(option.showData.defaultSort !== undefined)
            this.sortOption$.next(option.showData.defaultSort);

          // Show the lastUpdated column when we're training OR in basic mode
          this.showLastUpdatedInfo = this.showTrainingInfo ||
            (!this.showTrainingInfo && !this.showMooLaInfo);
        }
      }));
    const filteredEmployees$ = combineLatest(extraEmployees$, filterOption$).pipe(
      map(([e, f]) => filterEmployees(e, f)));
    const sortedEmployees$ = combineLatest(filteredEmployees$, this.sortOption$).pipe(
      map(([e, s]: [ExtraEmployee[], SortOption]) => sortEmployees(e, s)));

    this.employees$ = sortedEmployees$
    .pipe(
      map(employees => {
        const truncatedEmployees = this.filterOption$.value.truncateResults ?
          employees.slice(0, TrainingDashboardComponent.TRUNCATE_TO_LENGTH) :
          employees;

        if(truncatedEmployees.length)
          this.filterResults = {
            showing: truncatedEmployees.length,
            total: employees.length
          }
        else
          this.filterResults = undefined;

        return truncatedEmployees;
      }));

    this.sampleEmployee$ = extraEmployees$.pipe(
      tap(_employees => {
        // setTimeout to work around an error thrown on entering the page
        setTimeout(() => this.isLoading = false);
      }),
      map(employees => employees[0]));

    // Regenerate the unreadUpdate cache everytime the employee changes because the rules may change
    this.authService.employee$
    .pipe(takeUntil(this.stop$))
    .subscribe(employee => {
      if(!employee)   return;

      // Check for changes when the employee changes
      this.cd.markForCheck();

      // Generate the unreadUpdate cache
      this.generateUnreadUpdateCache();
    });
  }
  ngAfterViewInit() {
    // Checking here is sufficient for the loads, but I still receive an
    // ExpressionChangedAfterItHasBeenCheckedError. I don't know what to do about that.
    // It doesn't cause a problem in production.
    this.cd.markForCheck();
  }
  ngOnDestroy() {
    this.stop$.next();
  }

  mooLaOperationSuccess(input: any): void {
    console.log(`mooLaOperationSuccess:`, input);
  }
  mooLaOperationFailure(input: any): void {
    console.log(`mooLaOperatioFailure:`, input);
  }

  giveMooLa(to: Employee): void {
    this.mooLaService.giveWithPrompts(to)
      .then(this.mooLaOperationSuccess)
      .catch(this.mooLaOperationFailure);
  }
  grantMooLa(to: Employee): void {
    this.mooLaService.grantWithPrompts(to)
      .then(this.mooLaOperationSuccess)
      .catch(this.mooLaOperationFailure);
  }
  supplyMooLa(to: Employee): void {
    this.mooLaService.supplyWithPrompts(to)
      .then(this.mooLaOperationSuccess)
      .catch(this.mooLaOperationFailure);
  }
  chargeMooLa(from: Employee): void {
    this.mooLaService.chargeWithPrompts(from)
      .then(this.mooLaOperationSuccess)
      .catch(this.mooLaOperationFailure);
  }

  private generateUnreadUpdateCache(): void {
    this.unreadUpdatesCache = {
      employeeId: this.authService.getEmployee().id,
      maxUpdateTime: new Date(+(new Date()) - +this.configService.getConfig('client.ratingsNewForDays', 14) * oneDay),
    };
  }


  // Template functions
  getRecordClasses(record: ExtraEmployee): { [className: string]: boolean } {
    var classes = {
      softFilter: record.softFilter,
      unreadUpdate: false,
      notGroupMeConnected: false,
    }

    if (this.unreadUpdatesCache &&
        +record.employee.lastUpdated >= +this.unreadUpdatesCache.maxUpdateTime &&
        record.employee.lastRatingSeenBy.indexOf(this.unreadUpdatesCache.employeeId) === -1)
          classes.unreadUpdate = true;

    if (record.employee.groups.notGroupMeConnected &&
        this.businessCanProcessGroupMe)
          classes.notGroupMeConnected = true;

    return classes;
  }
  isSortActive(id: string): boolean {
    return this.sortOption$.value.id === id;
  }
  trackByEmployee(_index: number, record: ExtraEmployee): string {
    return record.employee.id;
  }

  resetFilter(): void {
    // This sends a signal into the child component which will actually handle it
    this.reset$.emit();
  }
  resetSort(): void {
    this.sortOption$.next({ id: 'lastUpdated', desc: true });
  }
  changeSort(id: string, descendingFirst?: boolean): void {
    const oldSort = this.sortOption$.value;

    this.authService.guestActivity("training-dashboard:change sort");

    // If this sort was already selected, reverse the order; else select this sort
    if(oldSort.id === id)
      this.sortOption$.next({ id, desc: !oldSort.desc });
    else
      this.sortOption$.next({ id, desc: !!descendingFirst });
  }

  // Private functions
  private setTitle(): void {
    this.titleService.set("Training Dashboard");
  }
}

interface AmountAndReason {
  amount: number;
  reason: string;
}
interface FilterResults {
  showing: number;
  total: number;
}
