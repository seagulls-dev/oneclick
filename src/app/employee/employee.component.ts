import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

import { TitleService } from 'src/app/services/title.service';
import { Employee, EmployeeId } from '../services/employee.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'oc-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employee$: Observable<Employee>;

  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    let employeeId$ = this.route.paramMap.pipe(
      map((params: ParamMap): EmployeeId => params.get('id') ));

    this.employee$ = combineLatest(this.authService.business$, employeeId$).pipe(
        switchMap(([business, employeeId]) => business && employeeId && business.employee$(employeeId) || of(null)),
        tap(employee => this.setTitle(employee)));
  }

  private setTitle(employee?: Employee): void {
    this.titleService.set(employee && employee.getName(true) || "");
  }
}
