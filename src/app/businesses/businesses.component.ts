import { Component, OnInit } from '@angular/core';
import { Business } from '../services/business.model';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { filter, take, map } from 'rxjs/operators';
import { TimeService } from '../organize-shifts/time.service';

@Component({
  selector: 'oc-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss']
})
export class BusinessesComponent implements OnInit {
  businesses$: Observable<Business[]>;
  private selected = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.businesses$ = this.authService.getAllBusinesses$().pipe(map(businesses => {
      // Default to sorting by business name
      businesses.sort((a, b) => a.info.name.localeCompare(b.info.name));
      return businesses;
    }));

    // Take first business after we've actually selected to go to one
    this.authService.business$.pipe(
      filter(b => this.selected),
      take(1),
    ).subscribe(business => {
      if (business) {
        this.router.navigate(['/organizeShifts']);
      }
    });
  }

  featureString(value: boolean|Date): string {
    if (value === true) {
      return 'Enabled'
    } else if (!value) { // Assuming non-specified features are disabled by default
      return '';
    } else {
      return 'Expires ' + TimeService.timeFromNow(value);
    }
  }

  viewBusiness(business: Business) {
    const current = this.authService.getBusiness();
    if (current && current.id === business.id) {
      // Already there, just go back to the page
      this.router.navigate(['/organizeShifts']);
    } else {
      this.selected = true;
      this.authService.switchBusinesses(business.id);
    }
  }
}
