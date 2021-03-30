import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { DestinationInfo } from '../services/destination.model';
import { EmployeeIdentifier } from 'database/db-user.model';

import { MenuIcon } from './menu-icon.model';
import MenuIcons from './menu-icons';
import { Router } from '@angular/router';
import { Business, EmployeeBusiness } from '../services/business.model';
import { AppUser } from '../auth/app-user.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-menu',
  templateUrl: './oc-menu.component.html',
  styleUrls: ['./oc-menu.component.scss']
})
export class OcMenuComponent implements OnInit, OnDestroy {
  menuIcons: MenuIcon[] = MenuIcons;

  nextDestination?: DestinationInfo;
  nextBusinessName = "";
  nextBusinessInfo: EmployeeBusiness;

  private stop$ = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    // Next Destination computer
    combineLatest(this.authService.business$, this.authService.destination$)
    .pipe(takeUntil(this.stop$))
    .subscribe(([business, destination]) => {
      if(!business || !destination)
        this.nextDestination = null;
      else
        this.nextDestination = business.nextDestination(destination);

      this.cd.markForCheck();
    });

    // Next Business computer
    combineLatest(this.authService.user$, this.authService.business$, this.authService.userBusinesses$)
    .pipe(takeUntil(this.stop$))
    .subscribe(([user, business, businesses]) => {
      if (this.authService.isSuperUser()) {
        this.nextBusinessName = "Business List";
      } else if (user && business && businesses && businesses.length > 1) {
        this.findNextBusiness(user, business, businesses);
      } else {
        this.nextBusinessName = "";
      }

      this.cd.markForCheck();
    });
  }
  ngOnDestroy() {
    this.stop$.emit();
  }

  findNextBusiness(user: AppUser, current: Business, businesses: EmployeeBusiness[]) {
    const currentIndex = businesses.findIndex(b => b.business.id === current.id);
    if (currentIndex >= 0) {
      const nextIndex = (currentIndex + 1) % businesses.length;
      this.nextBusinessInfo = businesses[nextIndex];
      this.nextBusinessName = this.nextBusinessInfo.business.info.name;
    } else {
      this.nextBusinessInfo = null
      this.nextBusinessName = "";
    }
  }

  clickNextBusiness() {
    if (this.authService.isSuperUser()) {
      this.router.navigate(['/businesses']);
    } else if (this.nextBusinessInfo) {
      this.authService.switchBusinesses(this.nextBusinessInfo.eid.businessId);
    }
  }
}
