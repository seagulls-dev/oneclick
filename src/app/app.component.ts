import { Component, HostBinding, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';

import { AuthService } from './auth/auth.service';
import { ScreenService } from './services/screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class.appMenu') appMenu = true;
  @HostBinding('class.appSidebar') appSidebar = false;
  @HostBinding('class.onePanel') onePanel = false;
  @HostBinding('class.splitPanels') splitPanels = true;
  @HostBinding('class.smallScreen') smallScreen = false;

  private stop$ = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private screenService: ScreenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.screenService.resize$
    .pipe(takeUntil(this.stop$))
    .subscribe(screenInfo => {
      this.appMenu = screenInfo.appMenu;
      this.appSidebar = !screenInfo.appMenu;
      this.onePanel = screenInfo.onePanel;
      this.splitPanels = !screenInfo.onePanel;
      this.smallScreen = screenInfo.smallScreen;
    });

    // this call will load after the scripts have loaded, thus ensuring our screen size has stabilized
    // ideally the only call needed would be the one within ScreenService,
    // but this one, root level, call seems ok to me too
    this.screenService.processScreenSize();

    // TODO: develop a more robust permission verification system
    this.authService.employee$
    .pipe(
      takeUntil(this.stop$),
      filter(e => e !== undefined && e !== null)) // We are only checking for underpriviledged employees here. Signed out ones will be delt with elsewhere
    .subscribe(employee => {
      if(!this.authService.can('useApplication')){
        console.warn(`Employee (${employee.name}) does not have permission to use the application for this business`)
        // Employee doesn't have permission to view this business; redirect to noPermission
        this.router.navigate(['/noPermission']);
      }else if(this.router.url === '/noPermission'){
        // Usage rights have been restored for the employee
        console.log("Permission rights restored to employee. Routing to the application");
        this.router.navigate(['/organizeShifts']);
      }
    })
  }
  ngOnDestroy() {
    this.stop$.next();
  }

  // ### Article on shortcut keys provided by Angular ###
  // https://netbasal.com/diy-keyboard-shortcuts-in-your-angular-application-4704734547a2
  // TODO: implement shortcut keys :)
}
