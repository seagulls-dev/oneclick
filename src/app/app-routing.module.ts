import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizeShiftsComponent } from './organize-shifts/organize-shifts.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employee/employee.component';
import { BusinessesComponent } from './businesses/businesses.component';
// import { ListsComponent } from './lists/lists.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { NoPermissionComponent } from './no-permission/no-permission.component';

const routes: Routes = [
  { path: 'organizeShifts',   component: OrganizeShiftsComponent,     canActivate: [AuthGuard] },
  { path: 'employees',        component: EmployeesComponent,          canActivate: [AuthGuard] },
  { path: 'employee/:id',     component: EmployeeComponent,           canActivate: [AuthGuard] },
  { path: 'businesses',       component: BusinessesComponent,         canActivate: [AuthGuard] },
  // { path: 'lists',            component: ListsComponent,              canActivate: [AuthGuard] }, // not implementing rn
  { path: 'noPermission',     component: NoPermissionComponent },
  { path: 'login',            component: LoginComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
