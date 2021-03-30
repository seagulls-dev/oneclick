import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Subject, of, Observable } from 'rxjs';
import { switchMap, takeUntil, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { List, ListItem, ListEvaluationResult } from './list.model';
import { ListEventData } from '../services/employee-ratings.model';
import { Employee } from '../services/employee.model';
import { Shift } from '../organize-shifts/shift.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnDestroy {
  @Input() shifts: Shift[];
  sortedEmployees: Employee[];

  lists$: Observable<List[]>;
  selectedList?: List;
  evaluatingEmployee?: Employee;

  status: ListStatus;

  private stop$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnDestroy() {
    this.stop$.next();
  }
  ngOnChanges() {
    this.sortedEmployees = this.sortShifts(this.shifts);
  }

  open() {
    this.lists$ = this.authService.destination$
    .pipe(
      switchMap(destination => destination ? destination.lists$ : of({})),
      map(lists => Object.values(lists) as List[]),
      tap(lists => {
        if(this.selectedList && !lists.find(l => l.id === this.selectedList.id))
          this.selectedList = undefined;
      }));

    this.authService.destination$
    .pipe(
      distinctUntilChanged(),
      takeUntil(this.stop$))
    .subscribe(_destination => this.status = ListStatus.viewing);

    this.cd.markForCheck();
  }
  async changeStatus(to: ListStatus): Promise<void> {
    let permission;
    switch(to) {
      case ListStatus.viewing:
        permission = "viewLists";
        break;
      case ListStatus.editing:
        permission = "editLists";
        break;
      case ListStatus.rating:
        permission = "passOffLists";
        break;
    }

    const can = await this.authService.canWithRequest(permission);
    if(!can)
      return;

    this.status = to;
    this.cd.markForCheck();
  }

  private sortShifts(shifts: Shift[]): Employee[] {
    if(!shifts || !shifts.length)
      return [];

    let employees: Employee[] = [];
    for(let shift of shifts)
      if(shift.owner)
        employees.push(shift.owner);

    return employees.sort((a, b) => a.name.localeCompare(b.name));
  }

  async createList(): Promise<void> {
    const destination = this.authService.getDestination();
    if(!destination)
      throw Error('Cannot create a list without a destination');

    if(!this.authService.can('editLists'))
      return;

    const title = prompt("What should the title of the new list be?", "");
    if(!title)
      return;

    await destination.createList(title);

    this.cd.markForCheck();
  }
  async deleteList(list: List): Promise<void> {
    if(!this.authService.can('editLists'))
      return;

    await list.deleteSelf();
    this.cd.markForCheck();
  }
  async submit(result: ListEvaluationResult, employee?: Employee): Promise<void> {
    if(!employee || !result)
      return;

    if(!this.authService.can('passOffLists'))
      return;

    const listEvaluation: ListEventData = {
      ...this.authService.generateBasicIdData(),

      list: result
    }

    return employee.submitListEvaluation(listEvaluation);
  }

  trackByList(_index, list: List): string {
    return list.id;
  }
}

export enum ListStatus {
  readonly = 0,
  viewing = 1,
  editing = 2,
  rating = 3,
}
