import { Component, OnInit, EventEmitter } from '@angular/core';
import { takeUntil, filter, switchMap } from 'rxjs/operators';

import { EmployeeCollection, Employee } from 'src/app/services/employee.model';
import { ConfigService } from 'src/app/config/config.service';
import { TimeService, oneDay } from 'src/app/organize-shifts/time.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TitleService } from 'src/app/services/title.service';

import { Section } from './section.model';
import { sortEmployees } from './sort-employees';

@Component({
  selector: 'oc-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  sections: Section[];

  stop$ = new EventEmitter<void>();

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.setTitle();

    this.authService.business$.pipe(
      takeUntil(this.stop$),
      filter(business => !!business),
      switchMap(business => business.employees$()),
      takeUntil(this.stop$)
    ).subscribe(employees => this.sections = this.processEmployees(employees));
  }
  ngOnDestroy() {
    this.stop$.next();
  }

  private processEmployees(employees: EmployeeCollection): Section[] {
    let newbies: Employee[] = [],
        teammembers: Employee[] = [],
        leaders: Employee[] = [];

    let newbiesForDays = this.configService.getConfig<number>('client.newbiesForDays', 30),
        newbieHiredThreshold = TimeService.add(new Date, -1 * newbiesForDays * oneDay);

    // add all the employees to the general list for
    // TODO: this is not a good code structure; I'll need to redo it once I figure this out
    for(let employeeId in employees){
      let employee = employees[employeeId];
      if(employee.hired >= newbieHiredThreshold)
        newbies.push(employee);
      else if(employee.hasRole('trainer'))
        leaders.push(employee);
      else
        teammembers.push(employee);

    }

    let sort = "name";

    if(this.authService.can('viewRatings'))
      sort = "lastUpdated";

    sortEmployees('newbies', sort, newbies);
    sortEmployees('teammembers', sort, teammembers);
    sortEmployees('leaders', sort, leaders);

    let sections: Section[] = [];
    if(newbies.length)
      sections.push({
        title: "New Hires",
        employees: newbies,
      });
    if(teammembers.length)
      sections.push({
        title: "Team Members",
        employees: teammembers,
      });
    if(leaders.length)
      sections.push({
        title: "Leaders",
        employees: leaders,
      });

    return sections;
  }

  private setTitle(): void {
    this.titleService.set('Employees');
  }

  trackByEmployee(_index: number, employee: Employee): string {
    return employee.id;
  }
  trackBySection(_index: number, section: Section): string {
    return section.title;
  }
}
