import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { CookieService } from 'ngx-cookie-service';

import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SaveWidgetComponent } from './save-widget/save-widget.component';
import { OrganizeShiftsComponent } from './organize-shifts/organize-shifts.component';
import { OcMenuComponent } from './oc-menu/oc-menu.component';
import { ShiftCardComponent } from './organize-shifts/shift-card/shift-card.component';
import { LayoutSelectorComponent } from './organize-shifts/layout-selector/layout-selector.component';
import { TimePipe } from './pipes/time.pipe';
import { DaySelectorComponent } from './organize-shifts/day-selector/day-selector.component';
import { DraggableDirective } from './drag-n-drop/draggable.directive';
import { DroppableDirective } from './drag-n-drop/droppable.directive';
import { TimeFromNowPipe } from './pipes/time-from-now.pipe';
import { PositionsComponent } from './organize-shifts/positions/positions.component';
import { ShiftsComponent } from './organize-shifts/shifts/shifts.component';
import { LoggerPipe } from './pipes/logger.pipe';
import { ModalComponent } from './modal/modal.component';
import { AddLayoutModalComponent } from './organize-shifts/add-layout-modal/add-layout-modal.component';
import { FromHoursFormatPipe } from './pipes/from-hours-format.pipe';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeCardComponent } from './employees/employee-list/employee-card/employee-card.component';
import { ListsComponent } from './lists/lists.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { HistoryEventComponent } from './employee/employee-detail/history-event/history-event.component';
import { RatingComponent } from './employee/employee-detail/rating/rating.component';
import { LoginComponent } from './login/login.component';
import { StarsWidgetComponent } from './employee/employee-detail/rating/stars-widget/stars-widget.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';
import { NoPermissionComponent } from './no-permission/no-permission.component';
import { TrainingDashboardComponent } from './employees/training-dashboard/training-dashboard.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { FilterOptionComponent } from './employees/training-dashboard/filter-option/filter-option.component';
import { ProfilePhotoPipe } from './pipes/profile-photo.pipe';
import { MoolaBillsComponent } from './organize-shifts/moola-bills/moola-bills.component';
import { InfiniteValueComponent } from './components/infinite-value/infinite-value.component';
import { PromptRatingsComponent } from './organize-shifts/prompt-ratings/prompt-ratings.component';
import { SwapPositionModalComponent } from './organize-shifts/positions/swap-position-modal/swap-position-modal.component';
import { ListComponent } from './lists/list/list.component';
import { BusinessesComponent } from './businesses/businesses.component';


@NgModule({
  declarations: [
    AppComponent,
    SaveWidgetComponent,
    OrganizeShiftsComponent,
    OcMenuComponent,
    ShiftCardComponent,
    LayoutSelectorComponent,
    TimePipe,
    DaySelectorComponent,
    DroppableDirective,
    DraggableDirective,
    TimeFromNowPipe,
    PositionsComponent,
    ShiftsComponent,
    LoggerPipe,
    ModalComponent,
    AddLayoutModalComponent,
    FromHoursFormatPipe,
    EmployeesComponent,
    EmployeeCardComponent,
    ListsComponent,
    EmployeeComponent,
    EmployeeDetailComponent,
    HistoryEventComponent,
    RatingComponent,
    LoginComponent,
    StarsWidgetComponent,
    BackButtonDirective,
    ProfilePhotoComponent,
    NoPermissionComponent,
    TrainingDashboardComponent,
    EmployeeListComponent,
    FilterOptionComponent,
    ProfilePhotoPipe,
    MoolaBillsComponent,
    InfiniteValueComponent,
    PromptRatingsComponent,
    SwapPositionModalComponent,
    ListComponent,
    BusinessesComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    DragDropModule,
    FormsModule,
    MarkdownModule.forRoot(),
    MatTooltipModule,
    BrowserAnimationsModule,
  ],
  providers: [
    CookieService,
    Title,
    TimePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
