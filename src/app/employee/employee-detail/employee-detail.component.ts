import { Component, OnInit, Input, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { ConfigService } from 'src/app/config/config.service';
import { MooLaService } from 'src/app/services/moo-la.service';
import { PhotoService } from 'src/app/services/photo.service';
import { cleanEmail } from 'src/app/helpers/snippet';

import { Employee, PositionScore } from 'src/app/services/employee.model';
import { LeadershipDefinition } from 'src/app/config/client-config.model';
import { PositionDefinition } from 'src/app/config/client-config.model';
import { HistoryEvent } from 'src/app/services/employee-ratings.model';
import { HintData } from 'src/app/organize-shifts/prompt-ratings/prompt-ratings.component';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit, OnChanges {
  // Employee being viewed
  @Input() employee?: Employee;

  permissionsList: LeadershipDefinition[];
  scores: PositionScore[];
  phone?: { number: number, formatted: string };
  email?: string;

  ratePosition$ = new BehaviorSubject<PositionDefinition|undefined>(undefined);
  hint?: HintData; // Data from the deeplink to a hint
  // Employee doing the viewing (currently logged in employee)
  private viewingEmployee: Employee;

  // TODO: store this on the viewing employee so it persists while viewing many people
  reviewOnlyMode = false;

  showExplainations = true;

  private stop$ = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private configService: ConfigService,
    public photoService: PhotoService,
    private route: ActivatedRoute,
    private router: Router,
    public mooLaService: MooLaService
  ) { }

  ngOnInit() {
    const destination$ = this.authService.destination$
    .pipe(filter(destination => destination !== undefined));

    // recheck the scores after the destination loads so that we have the config values
    // and reset the position rating when the destination changes
    destination$
    .pipe(takeUntil(this.stop$))
    .subscribe(() => {
      this.authService.guestActivity("employee-detail:load profile");
      this.scores = this.employee ? this.employee.getScoresList() : [];
    });

    // Watch for the deep link to a rating in the route params
    // I don't need to deal with unsubscriptions because the Router will do that
    // https://angular.io/guide/router#observable-parammap-and-component-reuse
    // Wait for the destination to load so we have the progression config on hand
    combineLatest(this.route.paramMap, destination$)
    .pipe(
      map(([params, _destination]) => {
        const positionId = params.get('position');
        if(!positionId){
          this.hint = undefined;
          return undefined;
        }

        const hintCode = params.get('code');
        if(hintCode){
          this.hint = {
            code: +hintCode,
            position: positionId,
            name: params.get('name')
          }
        }else
          this.hint = undefined;

        if(positionId === 'general')
          return { id: "general", title: "General" }; // Special value without position

        const progression = this.configService.getConfig<PositionDefinition[]>('client.progression', []);
        const position = progression.find(pos => pos.id === positionId);

        if(position)
          return position;
        else if(!position){
          console.warn(`Could not find positionId '${positionId}' in list of ${progression.length} positions`);
          this.doRatePosition(false);
          return undefined; // it will fire again and return the same result
        }
      }))
    .subscribe(this.ratePosition$);

    // recheck the permissions whenever the signed in employee changes
    combineLatest(this.authService.employee$, destination$)
    .pipe(takeUntil(this.stop$))
    .subscribe(([employee, _destination]) => {
      // TODO: when the guest employee logs out,
        // if the profile was open to the guest employee,
        // I would like to redirect to the newly signed in employee.
        // Right now, I don't have a way to detect that.

      this.permissionsList = this.getPermissions(employee);
      this.viewingEmployee = employee;
      this.tryLoadData(this.viewingEmployee);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if(!this.employee) return;

    this.scores = this.employee.getScoresList();

    if (changes.employee.previousValue &&
        changes.employee.previousValue.id ===
        changes.employee.currentValue.id)
        return; // don't perform these actions if the employee was simply reloaded with new data

    this.tryLoadData(this.viewingEmployee);
  }
  ngOnDestroy() {
    this.stop$.emit();
  }

  private tryLoadData(viewingEmployee: Employee): void {
    if(!this.employee)    return;

    // TODO: load only the ratings for the current destination
    if(viewingEmployee && this.authService.can('viewRatings', this.employee))
      this.employee.getHistory(viewingEmployee);

    this.employee.getParty('HotSchedules', 'OneClick').then(() => {
      this.phone = this.getPhoneNumber(this.employee);
      this.email = this.getEmail(this.employee);
    });
  }

  isNotGroupMeConnected(employee: Employee): boolean {
    return employee && employee.groups &&
      employee.groups.notGroupMeConnected &&
      this.authService.businessCan('processGroupMe') ||
      false;
  }
  getPhoneNumber(employee: Employee): { number: number, formatted: string }|undefined {
    if(!employee)   return;

    for(let partyId of ["OneClick", "HotSchedules"]){
      let party = employee.parties[partyId];
      if(party && party.phoneNumber)
        return {
          number: party.phoneNumber,
          formatted: party.phoneNumberObject && party.phoneNumberObject.formatted || "",
        };
    }
  }
  getEmail(employee: Employee): string|undefined {
    if(!employee)   return;


    for(let partyId of ["OneClick", "HotSchedules"]){
      let party = employee.parties[partyId];
      if(party && party.email)
        return party.email;
    }
  }

  async linkToAnotherEmail(): Promise<boolean> {
    const business = this.authService.getBusiness();

    if(!business || !this.employee)
      return;

    const email = prompt(`Which email address does ${this.employee.name} want to use to access OneClick.Team?`, "dacowz@oneclick.team");
    if(!email)
      return;

    const validEmail = cleanEmail(email);
    if(!validEmail){
      alert(`That email is not valid: ${email}`);
      return;
    }

    const success = await business.linkEmployeeToEmail(this.employee, validEmail);
    if(success)
      alert(`The operation succeed! Have ${this.employee.getName()} try logging in now.`);
    else
      alert(`An issue occured. The email address may not have been valid`);

    return success;
  }
  getPermissions(employee: Employee): LeadershipDefinition[] {
    if(!employee)
      return [];

    const leadershipProgression = this.configService.getConfig<LeadershipDefinition[]>('client.leadershipProgression', []);
    const filteredProgression = leadershipProgression.filter(r => !r.private && employee.hasRole(r.role));
    return filteredProgression;
  }

  canUseTopHalfResetGroupMeButton(employee: Employee): boolean {
    return employee &&
      this.authService.businessCan('processGroupMe') &&
      this.authService.can('performAdvancedProfileOperations', employee) ||
      false;
  }
  canUseTopHalfLinkEmailButton(employee: Employee): boolean {
    return this.authService.can('performAdvancedProfileOperations', employee);
  }
  canPressTopHalfGiveMooLaButton(employee: Employee): boolean {
    return employee && this.authService.businessCan('useMooLa') &&
      !this.authService.employeeIs(employee) &&
      !this.authService.can('viewMooLa');
  }
  canViewMooLaReport(employee: Employee): boolean {
    return employee && this.authService.businessCan('useMooLa') &&
      (this.authService.employeeIs(employee) ||
      this.authService.can('viewMooLa'));
  }

  async scoreClick(score: PositionScore): Promise<void> {
    this.authService.guestActivity("employee-detail:click score buttons");

    const ratePosition = this.ratePosition$.value;
    if(ratePosition && ratePosition.id === score.positionId)
      return this.doRatePosition(false);

    const hasPermissionToCreateRating = await this.authService.canWithRequest('createRatings', this.employee);
    if(!hasPermissionToCreateRating)
      return;

    this.doRatePosition(score.positionId);
  }
  private doRatePosition(id: string|false): void {
    if(id)
      this.router.navigate(['./', {position: id}], { relativeTo: this.route, replaceUrl: true });
    else
      this.router.navigate([this.router.url.split(";")[0]], { replaceUrl: true }); // manually chop off the data points
  }
  rateWithoutPosition(): void {
    // Provide a special value that the component will recognize to skip the position
    this.authService.guestActivity("employee-detail:do a general rating");
    this.doRatePosition("general"); // All other positionId's begin with an '@'
  }

  saveNickname(nickname: string): void {
    let oldNickname = this.employee.nickname;

    this.authService.guestActivity("employee-detail:change nickname");

    if (!nickname || !nickname.length)
      this.employee.nickname = null;
    else if(nickname === this.employee.getName(true) ||
            nickname === this.employee.getName())
      return; // don't make any change if the nickname is a version of the given name
    else
      this.employee.nickname = nickname;

    if(oldNickname != this.employee.nickname)
      this.employee.save();
  }
  savePin(pin: string): void {
    let pinNumber = parseInt(pin),
        oldPin = this.employee.pin;

    this.authService.guestActivity("employee-detail:change pin");
    // TODO: check if multiple people have the pin before saving it

    if(pin === '' || !pin.length)
      this.employee.pin = null;
    else if(isNaN(pinNumber))
      return;
    else
      this.employee.pin = pinNumber;

    if(oldPin !== this.employee.pin)
      this.employee.save();
  }
  savePermissions(permissions): void {
    var roles = {};
    for(let input of permissions.querySelectorAll('input'))
      roles[input.id] = input.checked;

    this.authService.guestActivity("employee-detail:change permissions");

    this.employee.updatePermissions(roles);
  }

  canChange(permission: LeadershipDefinition) {
    // If a director is viewing themself, don't let them change their team member or director status
    if (this.authService.employeeIs(this.employee)) {
      if (this.employee.hasRole('director', true)) {
        if (permission.role === 'teamMember' || permission.role === 'director') {
          return false;
        }
      }
    }
    return true;
  }

  trackByScore(_index: number, score: PositionScore): string {
    return score.positionId;
  }
  trackByHistory(_index: number, event: HistoryEvent<any>): string {
    return event.id;
  }
  trackByPermission(_index: number, permission: LeadershipDefinition): string {
    return permission.role;
  }
}
