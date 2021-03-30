import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AppUser } from './app-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|Observable<boolean>|Promise<boolean> {
    let url = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url): Observable<boolean>|boolean {
    // TODO: this is not a robust solution, but it should get the job done for now
    // This will be very prone to strange bugs...


    // If the employee has already loaded, automatically pass/fail based on their employee permissions
    if(this.authService.isEmployeeLoaded()){
      if(this.authService.can('useApplication'))
        return true;
      else{
        // Employee doesn't have permission to view this business; redirect to noPermission
        this.router.navigate(['/noPermission']);
        return false;
      }
    }

    // otherwise, wait for the user and perform very rudimentary checks
    // For a more secure solution, always load the employee first and decide based on those permissions
    return this.authService.user$
      .pipe(
        // these pipes prevent the app from loading the login screen when the
        // user is signed in, but the firebase listeners haven't yet fired
        filter(user => user !== undefined),
        first(),
        map((user: AppUser): boolean => {
          // Store the attempted URL for redirecting
          this.authService.redirectUrl = url;

          // TODO: check if the employee has permission before navigating
          // this is hard because I haven't yet loaded the employee...

          if(this.authService.isSuperUser())
            return true;

          if(this.authService.isAssociatedWithABusiness())
            return true;

          // User not logged in; redirecting to login
          this.router.navigate(['/login']);
          return false;
        }));
  }
}
