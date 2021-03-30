import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { MooLaBill } from 'src/app/config/moola-config.model';
import { MooLaDestination } from 'src/app/services/employee.model';
import { MooLaService } from 'src/app/services/moo-la.service';

@Component({
  selector: 'oc-moola-bills',
  templateUrl: './moola-bills.component.html',
  styleUrls: ['./moola-bills.component.scss']
})
export class MoolaBillsComponent implements OnInit, OnDestroy {
  bills: MooLaBill[];
  employeesBudget: number;

  private stop$ = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public mooLaService: MooLaService,
  ) {
    this.bills = [];
    this.employeesBudget = 0;
  }

  ngOnInit() {
    // TODO: there might be visual bugs because I'm not evaluating the screen size here...
    // This might not be an issue. More likely so because this will always load
    // after the shifts component

    // Get the data once, and get it again whenever the person changes
    // since it depends on the permission of the employee
    this.authService.employee$
    .pipe(takeUntil(this.stop$))
    .subscribe(employee => {
      this.loadBills();

      this.employeesBudget = this.mooLaService.getBudgetOrInfinity(employee);
    });

    // Ensure the bills load; We still offer clicking as a backup...
    // Mostly, I expect this process to go quickly
    const MAX_TRIES = 8;
    timer(0, 200)
    .pipe(takeWhile(x => (!this.bills || !this.bills.length) && x < MAX_TRIES))
    .subscribe(_x => this.loadBills());
  }
  ngOnDestroy() {
    this.stop$.emit();
  }

  loadBills(): void {
    this.bills = this.mooLaService.getBills();
  }

  trackByBillValue(_index: number, bill: MooLaBill): number {
    return bill.value;
  }
}
