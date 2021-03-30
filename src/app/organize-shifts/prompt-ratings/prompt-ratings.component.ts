import { Component, OnInit, Input, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, Subject } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '../../config/config.service';
import { oneWeek, oneHour, TimeService } from '../time.service';
import { PositionDefinition } from '../../config/client-config.model';
import { toArray } from '../../helpers/snippet';

import { Layout, Position } from '../layout.model';
import { Hint } from './hint-list.model';
import { Employee, EmployeeCollection, Score, PositionInformation } from '../../services/employee.model';
import { PositionId } from '../../config/layout-generation-config.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-prompt-ratings',
  templateUrl: './prompt-ratings.component.html',
  styleUrls: ['./prompt-ratings.component.scss']
})
export class PromptRatingsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() layout: Layout;

  public hints$: Observable<Hint[]|undefined>;

  private layout$ = new Subject<Layout>();
  private stop$ = new Subject();

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private router: Router
  ) { }

  ngOnInit() {
    const business$ = this.authService.business$
      .pipe(filter(b => !!b));
    const employees$ = business$.pipe(
        switchMap(b => b.employees$()))
    this.hints$ = combineLatest(this.layout$, employees$)
      .pipe(map(([l, e]) => this.generateHints(l, e)));
  }
  ngOnChanges(_simpleChanges) {
    // Recheck the hints when the layout changes
    this.layout$.next(this.layout);
  }
  ngOnDestroy() {
    this.stop$.next();
  }

  generateHints(layout: Layout, employees: EmployeeCollection): Hint[] {
    // Generate hints for the owner of every shift according to the assigned position
    // Store only the highest priority hint for every employee
    if(!layout || !employees)
      return [];

    var employeeHints: { [employeeId: string]: Hint } = {};
    layout.forEachPosition(position => {
      if(!position.requireTraining)
        return;

      for(let ownerId of position.shifts){
        const employee = employees[ownerId];
        if(!employee)
          continue;

        const hint = this.generateHint(position, employee);
        if(!hint)
          continue;

        // If there isn't already a hint, or the hint is a lower priority, save this one
        if(!employeeHints[ownerId] || employeeHints[ownerId].priority < hint.priority)
          employeeHints[ownerId] = hint;
      }
    })

    // Convert the map into an array
    const hints: Hint[] = Object.values(employeeHints);

    if(!hints.length)
      return; // undefined allows the empty state to be displayed

    // Sort the highest ones first
    const sortedHints = hints.sort((a, b) => {
      return 0 ||
        b.priority - a.priority ||
        b.code - a.code ||
        b.employee.getHighestPositionIndex() - a.employee.getHighestPositionIndex() ||
        0;
    })

    return sortedHints;
  }
  private generateHint(position: Position, employee: Employee): Hint|undefined {
    // Will return `undefined` if no hint can be found

    var lastRating: Score, positionInfo: PositionInformation; // Store this out here so it can be easily accessed by finish function
    var finish = (code: number): Hint => this.buildMessage(code, position, employee, lastRating ? {data: lastRating, info: positionInfo} : undefined);

    const sixMonths = 26; // Six months are actually 26 weeks, not 24. TODO: put in a more central location
    const progression = this.configService.getConfig<PositionDefinition[]>('client.progression', []);

    // This will be '@iPOS' or '@frontCounter' etc...
    const requirements = toArray(position.requireTraining);
    for(let positionId of requirements){
      lastRating = employee.scores[positionId];
      const position = progression.find(p => p.id === positionId);
      if(!position)
        continue; // This frequently happens if the data lines up wrong or if some other regular issue occurs
      positionInfo = employee.getPositionInfo(position)

      // Use the ceiling to simplify the operators in the comparisons below
      // Add twelve hours so that the hints will trigger if
        // they are reviewing during scheduled time every week.
      const ratingAgeWeeks = lastRating ? Math.ceil((+Date.now() - +lastRating.lastUpdated + 12 * oneHour) / oneWeek) : Infinity;

      // Indicates if there is qualified training above this position, or if this person is a leader
      const higherTraining = employee.groups.leader ||
        (employee.getHighestPositionIndex({qualified: true}) >
        progression.findIndex(p => p.id === positionId));

      // Begin the checking

      // I fear that excluding the 'good' ratings will cut their progress short
      // effectively cutting them off from receiving higher scores.
      // I'm going to go with it for now so that this remains a *high* priority prompt
      if(employee.groups.newbie && ratingAgeWeeks > 1 && !positionInfo.superGood && !positionInfo.good)
        return finish(403);

      // TODO: refactor to pass in the shifts so I can check for training shifts
      // if(shift.training)
      //   return finish(402);

      if((!lastRating || !lastRating.rating) && !higherTraining)
        return finish(401);

      if(!lastRating || !lastRating.rating)
        return finish(302);

      if(!positionInfo.superGood &&
        ((ratingAgeWeeks > sixMonths && !employee.groups.leader)
        || ratingAgeWeeks > sixMonths*2))
        return finish(301);

      if(positionInfo.underQualified && ratingAgeWeeks > 4)
        return finish(201);

      // TODO: pass in the layout time so it can be checked for a busy period
      // NOTE: this is a pseudo-if statement
      // if(!positionInfo.superGood && !positionInfo.good &&
          // time.isRushHour && ratingAgeWeeks > sixMonths/2)
        // return finish(202);

      // Right now I include them because they are useful, especially on phones
      // continue; // TODO: provide an option to show/hide these 1xx messages

      if(ratingAgeWeeks > 1)
        return finish(101);
    }

    return undefined; // no applicable hints
  }
  private buildMessage(code: number, position: Position, employee: Employee, lastRating?: {data: Score, info: PositionInformation}): Hint {
    const employeeName = `<b>${employee.getName()}</b>`;
    const positionName = `<b>${position.title}</b>`;
    const priority = Math.floor(code / 100);

    var t: string, m: string = "", i: string, c: string; // title, message, icon, color
    switch(code) {
      case 401:
        t='New position',
        m=`It looks like ${employeeName} learned ${positionName}! Let's hear the report.`,
        i='thumbs-up'; break;
      case 402:
        t='Scheduled training',
        m=`It looks like ${employeeName} was practicing ${positionName}. Can you share the details?`,
        i='chalkboard-teacher'; break;
      case 403:
        t='New hire',
        m=`${employeeName} is new here! How is (s)he on ${positionName}?`,
        i=`seedling`,
        c='green'; break;
      case 301:
        t='Outdated rating',
        m=`How is ${employeeName} on ${positionName}?`,
        i='hourglass-end'; break;
      case 302:
        t='Missing rating',
        m=`How is ${employeeName} on ${positionName}?`,
        i='question'; break;
      case 201:
        t='Low rating',
        m=`Has ${employeeName} improved on ${positionName}?`,
        i='level-up-alt'; break;
      case 202:
        t='Possible improvement',
        m=`Has ${employeeName} improved on ${positionName} since working the rushes? `,
        i='level-up-alt'; break;
      case 101:
        m=`How was ${employeeName} on ${positionName}?`,
        i='pencil-alt'; break;
      default:
        throw Error(`Unrecognized hint message code: ${code}`);
    }

    // If a the most recent rating is included, write in the information
    if(lastRating){
      let status: string;
      if(lastRating.info.superGood)
        status = "super star";
      else if(lastRating.info.good)
        status = "above average";
      else if(lastRating.info.qualified)
        status = "qualified";
      else if(lastRating.info.unqualified)
        status = "not qualified";
      else
        status = "## Error ##";

      const timeAgo = TimeService.timeFromNow(lastRating.data.lastUpdated);

      const message = `Rated <b>${status}</b> ${timeAgo}`;
      // const message = `Received ${score} stars ${timeAgo}`;
      m += `<br><span class="lastRating">${message}</span>`;
    }

    if(!i)
      switch(priority){
        case 4: i = 'exclamation-triangle';   break;
        case 3: i = 'exclamation-circle';     break;
        case 2: i = 'level-up-alt';           break;
        case 1: i = 'info-circle';            break;
        default:
          throw Error(`Unrecognized priority code: ${priority}`);
      }

    if(!c)
      switch(priority){
        case 4: c = 'blue';      break;
        case 3: c = 'orange';   break;
        case 2: c = 'purple';    break;
        case 1: c = 'grey';     break;
        default:
          throw Error(`Unrecognized priority code: ${priority}`);
      }

    return {
      employee,
      position,
      code,
      priority,
      color: c,
      icon: i,
      title: t,
      message: m
    }
  }

  goToProfile(hint: Hint): void {
    const requireTraining = hint.position.requireTraining;
    const data: HintData = {
      position: toArray(requireTraining)[0],
      code: hint.code,
      name: hint.position.title
    }

    const matrixNotation = true;
    if(matrixNotation)
      this.router.navigate(['/employee', hint.employee.id, data]);
    else
      this.router.navigate(['/employee', hint.employee.id], { queryParams: data});
  }
}

export interface HintData {
  position: PositionId; // always one position
  code: number; // 401 -- identifies the hint algorithm that flagged the rating
  name: string; // 'Front Counter 1' -- the name of the position where the employee was working
}
