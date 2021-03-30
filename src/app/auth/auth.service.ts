import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, BehaviorSubject, of, timer, zip } from 'rxjs';
import { map, filter, switchMap, tap, distinctUntilChanged, take } from 'rxjs/operators';
import firebase from '@firebase/app';
import { User as AuthUser} from '@firebase/auth-types';
import { DocumentReference } from '@firebase/firestore-types';
import { CookieService } from 'ngx-cookie-service';

import { AppUserService } from './app-user.service';
import { BusinessService } from '../services/business.service';
import { ConfigService } from '../config/config.service';
import { FirestoreService } from '../services/firestore.service';
import { LoginProvider } from './login-providers.model';
import { PhotoService } from '../services/photo.service';
import { safeLoad } from '../helpers/rxjs';
import { TimeService, oneMonth } from '../organize-shifts/time.service';

import { AppUser, AppUserConstructionObj, BasicUserInformation } from './app-user.model';
import { Employee, EmployeeId, RoleId, BasicEmployeeInformation, BasicEmployee } from '../services/employee.model';
import { linkPendingAccounts } from './pending-accounts';
import { Business, BusinessPermission, BusinessPermissionId, EmployeeBusiness, BusinessId } from '../services/business.model';
import { Destination, DestinationInfo, DestinationId } from '../services/destination.model';
import { ActivityPermission, ActivityPermissionId } from '../config/client-permission-config.model';
import { SubmittedBy, BasicIdData } from './submitted-by.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // These are undefined until they have a value. After having a value, the loss of a value will result in null
  private _user$ = new BehaviorSubject<AppUser|null|undefined>(undefined);
  private _business$ = new BehaviorSubject<Business|null|undefined>(undefined);
  private _employee$ = new BehaviorSubject<Employee|null|undefined>(undefined);
  private _destination$ = new BehaviorSubject<Destination|null|undefined>(undefined);
  private tempEmployeeId$ = new BehaviorSubject<EmployeeId|undefined>(undefined);
  private _userBusinesses$ = new BehaviorSubject<EmployeeBusiness[]|null>(null);

  private _requestDestination$ = new BehaviorSubject<DestinationId|null|undefined>(undefined);
  private _requestBusiness$ = new BehaviorSubject<BusinessId|null|undefined>(undefined);

  user$ = this._user$.asObservable()
  business$ = this._business$.asObservable();
  employee$ = this._employee$.asObservable();
  destination$ = this._destination$.asObservable();
  userBusinesses$ = this._userBusinesses$.asObservable();
  version$ = this.firestore.version$.asObservable();

  redirectUrl?: string;
    // A state needed by login.component to be persisted
    // in case the login screen must be displayed several times.
  authUiInstance?: any; // Should be firebaseui.auth.AuthUI, but that causes backend server scripts to complain

  constructor(
    private appUserService: AppUserService,
    private businessService: BusinessService,
    private configService: ConfigService,
    private cookies: CookieService,
    private firestore: FirestoreService,
    private photoService: PhotoService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.appUserService.start(this.firestore.env);
    this.businessService.start(this.firestore.env);

    // List of current user's businesses
    this.user$.pipe(
      filter(user => user !== undefined), // Ignore startup
      switchMap(user => {
        return this.getAllUserBusinesses$(user);
      })
    ).subscribe(businesses => {
      // Remove any businesses that don't actually exist
      // (ideally done in getAllUserBusinesses$, but easier here)
      let removeIndex = businesses.findIndex(b => !b.business);
      while (removeIndex >= 0) {
        businesses.splice(removeIndex, 1);
        removeIndex = businesses.findIndex(b => !b.business);
      }

      // If not super user or demo store user and Demo businesses is listed,
      // remove it entirely and pretend it doesn't exist
      if (!(this.isDemoStoreUser() || this.isSuperUser())) {
        const demoBusinessIndex = businesses.findIndex(b => b.business.id === 'oneClickLiveDemo');
        if (demoBusinessIndex >= 0) {
          businesses.splice(demoBusinessIndex, 1);
        }
      }

      console.log('User Businesses', businesses.length);
      this._userBusinesses$.next(businesses);
    });

    // Current business
    // Load from cookies if exists, otherwise from user's first listed business
    this.userBusinesses$.pipe(
      filter(businesses => !!businesses), // Ignore the startup null, but allow e.g. an empty list
      map(businesses => {
        // If no business yet, use any cookie-stored one
        const cookieBusiness = this.cookies.get('businessId');
        if (!this._business$.value && cookieBusiness) {
          // If superuser or cookiebusiness is in userBusinesses array, then may load it
          if (this.isSuperUser() || businesses.find(b => b.eid.businessId === cookieBusiness)) {
            return cookieBusiness;
          }
        }

        // Use user's first-listed business
        return (businesses && businesses[0] && businesses[0].eid.businessId) || null;
      })
    ).subscribe(this._requestBusiness$);

    this._requestBusiness$.pipe(
      filter(id => id !== undefined), // Ignore startup
      distinctUntilChanged(),
      switchMap(businessId => {
        if (businessId) {
          return this.businessService.get$(businessId).pipe(take(1));
        }
        return of(null);
      }),
      tap(business => {
        // Important to unload the previous business before loading the new one
        // todo does this unload it "enough"?
        const oldBusiness = this._business$.value;
        if (oldBusiness) {
          // This also results in undefined on Employee and Destination,
          // which should then be given appropriate values after business$ goes through
          this.businessService.removeItem(oldBusiness.id);
        }
      }),
      safeLoad(),
      switchMap(async business => {
        business = await this.checkSuperUserBusiness(business);
        if (business) {
          this.setCookie('businessId', business.id);
        }
        return business;
      })
    ).subscribe(business => {
      console.log('Change Business', business && business.info.name);
      this._business$.next(business);
    });

    // Current destination in current business
    // Load from cookies if exists, otherwise from first listed in business.destinationInfo
    this.business$.pipe(
      filter(b => b !== undefined), // Ignore startup
      map(business => {
        if (!business) {
          return null;
        }

        // If no destination yet, use any cookie-stored one
        const cookieDestination = this.cookies.get('destinationId');
        if (!this._destination$.value && cookieDestination) {
          // Make sure actually exists in this destination
          if (business.destinationInfo.find(d => d.id === cookieDestination)) {
            return cookieDestination;
          }
        }

        // Use business's first-listed destination
        return business.destinationInfo[0].id;
      })
    ).subscribe(this._requestDestination$);

    this._requestDestination$.pipe(
      filter(id => id !== undefined), // Ignore startup
      switchMap(destinationId => {
        if (destinationId && this._business$.value) {
          this.setCookie('destinationId', destinationId);
          return this._business$.value.destination$(destinationId);
        }
        return of(null);
      }),
      safeLoad()
    ).subscribe(destination => {
      console.log('Change Destination', destination && destination.name);
      this._destination$.next(destination);
    });

    // Current employee within current business
    combineLatest(
      this.user$,
      this.business$,
      this.tempEmployeeId$
    ).pipe(
      map(([user, business, tempEmployeeId]): [Business, string] => {
        if (!business) {
          return [business, null];
        }

        // If there's a temporary employee, use that.
        // Otherwise if super user, use that superuser's employee (matches isSuperUser id).
        // Otherwise, use the id in the user's business list for the current business.
        let employeeId = '';
        if (tempEmployeeId) {
          employeeId = tempEmployeeId;
        } else if (user && user.isSuperUser) {
          employeeId = user.isSuperUser;
        } else {
          // If we have a business, then userBusinesses must exist (and business must be inside it)
          const businessEmployee = this._userBusinesses$.value.find(b => b.eid.businessId == business.id);
          // *except, when logging out business seems to still be briefly defined but we don't find it?
          // weird, but not worth looking into right now
          employeeId = (businessEmployee && businessEmployee.eid && businessEmployee.eid.employeeId) || null;
        }
        return [business, employeeId || null];
      }),
      filter(([bus, emp]) => bus !== undefined), // Ignore startup
      distinctUntilChanged(([oldBus, oldEmp], [newBus, newEmp]) => {
        // Would just check the employeeId, but that might not have changed even though business has
        // (especially common for super users)
        if (oldBus && newBus) {
          if (oldBus.id !== newBus.id) {
            // New business, change
            return false;
          }
        } else if (!oldBus || !newBus) {
          // New business/null, change
          return false;
        }
        return oldEmp === newEmp;
      }),
      switchMap(([business, employeeId]) => (business && employeeId) ? business.employee$(employeeId) : of(null))
    ).subscribe(employee => {
      console.log('Change Employee', employee && employee.name);
      this._employee$.next(employee);

      if (employee && !this.hasPermission(employee, 'useApplication').allowed) {
        this.router.navigate(['/noPermission']);
      }
    });

    // Temporary Employee
    this.tempEmployeeId$
    .pipe(
      filter(id => id !== undefined),
      // TODO: cancel the timer when the id is `undefined` so that it doesn't fire again in the background
      switchMap(() => timer(this.configService.getConfig<number>('client.guestInactivityBeforeLogoutMinutes', 5) * 1000*60)))
    .subscribe(() => this.guestSignOut());

    // Watch the firebase auth state; this re-logs in after reload
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.signInWithUser(user);
      }else{
        // signed out
        this.signOutOfUser();
      }
    });
  }

  /**
   * If super user is not already in the business, adds a super user employee.
   * Note: business must be already loaded
   **/
  private async checkSuperUserBusiness(business?: Business) {
    if (!business) {
      return business;
    }
    const user = this.getUser();
    if (!user.isSuperUser) {
      return business;
    }

    const newRef: DocumentReference = (business as any).ref.collection('employees').doc(user.isSuperUser);

    const snapshot = await newRef.get();
    if (snapshot.exists) {
      await newRef.update({
        roles: {
          director: true,
          serviceAccount: true,
        }
      });
    } else {
      let employee: BasicEmployee = {
        isAdminAccount: true,
        name: user.name,
        hired: new Date,
        birthday: new Date,
        roles: {
          director: true,
          serviceAccount: true
        },
        userId: user.id,
      };
      console.log(`Creating super employee for ${user.name} in business ${business.info.name}`);
      await newRef.set(employee);
    }
    return business;
  }

  /**
   * Gets a list of all businesses associated with the user.
   * Notably, these will be unloaded and so only have basic info (e.g. name).
   */
  private getAllUserBusinesses$(user: AppUser): Observable<EmployeeBusiness[]> {
    if (!user || !user.businesses || !user.businesses.length) {
      return of([]);
    }

    return zip(
      ...user.businesses.map(eid => {
        return this.businessService.get$(eid.businessId).pipe(
          map(business => {
            return {business, eid};
          }),
          take(1)
        );
      })
    );
  }

  /**
   * Gets an (unloaded) list of all businesses (super user only)
   */
  getAllBusinesses$(): Observable<Business[]> {
    if(!this.isSuperUser()){
      return of([]);
    }

    return this.businessService.getAll$()
      .pipe(map(bin => {
        let array = [];
        for(let businessId in bin)
          array.push(bin[businessId]);
        return array;
      }));
  }

  isLoggedIn(): boolean {
    return !!this._user$.value;
  }
  isAssociatedWithABusiness(): boolean {
    return this.isLoggedIn() && (this.isSuperUser() || !!this._user$.value.businesses.length);
  }
  isGuestSignedIn(): boolean {
    return !!this.tempEmployeeId$.value;
  }
  isSuperUser(): boolean {
    const user = this._user$.value;
    return user && !!user.isSuperUser;
  }
  isDemoStoreUser(): boolean {
    const user = this._user$.value;
    return user && !!user.isDemoStoreUser
  }

  isEmployeeLoaded(): boolean {
    return !!this._employee$.value;
  }

  employeeHasRole(roleId: RoleId, strict?: boolean): boolean {
    let employee = this._employee$.value;
    if(!employee)
      return false;

    return employee.hasRole(roleId, strict);
  }
  employeeIs(employee: Employee): boolean {
    let _employee = this._employee$.value;
    if(!_employee || !employee)
      return false;

    return _employee.id === employee.id;
  }

  businessHasPermission(activityId: BusinessPermissionId): HasPermissionResponse {
    const business = this.getBusiness();

    if(!business)
      return fail('error');

    const permissionValue: BusinessPermission = business[activityId];
    const type = typeof permissionValue
    if(type === 'number' || type === 'string')
      return fail('error');

    if(permissionValue === false || !permissionValue)
      return fail('businessPermission');
    else if(permissionValue === true)
      return pass();

    if(+permissionValue < +(new Date))
      return fail('businessPermissionExpired');

    return pass();

    // TODO: provide a mechanism, similar to the regular permission objects,
    // to pass around friendly names to read to the user if necessary
    function pass(): HasPermissionResponse {
      return {
        allowed: true,
        name: activityId,
      };
    }
    function fail(failure: HasPermissionFailure): HasPermissionResponse {
      return {
        allowed: false,
        name: activityId,
        failure
      }
    }
  }
  businessCan(activity: BusinessPermissionId): boolean {
    const hasPermission = this.businessHasPermission(activity);
    return !!hasPermission.allowed;
  }
  hasPermission(employee: Employee, activity: ActivityPermissionId, targetEmployee?: Employee): HasPermissionResponse {
    let response: HasPermissionResponse|false;

    const permission = this.configService.getConfig<ActivityPermission>(`client.permissions.${activity}`, false);
    if (!permission) {
      // Permission doesn't exist in business config, not allowed by business in the first place.
      return fail("requireRoles");
    }
    if(!employee){
      // I don't want to throw here because then the code could fail if the config is not properly set up
      // I also can't complain here because that slows down the app majorly when an error is occuring
      return fail('error');
    }

    // if they are archived, they no longer work here. We need to shut it down to prevent abuse, harrasment, and data leaks
    if(employee.archived)
      return fail('archived');

    for (let businessPermissionId of permission.requireBusinessPermission || []) {
      const hasPermission = this.businessHasPermission(businessPermissionId);
      if(!hasPermission.allowed)
        return hasPermission;
    }

    // the permissions just need to be configured to work correctly
    // I can't disable this shortcut yet because I haven't implemented more flexible permission rules...
    // TODO: implement more flexible permission rules
    if(employee.hasRole('director'))
      return pass()

    if(!targetEmployee && permission.allowGeneral === true)
      targetEmployee = {} as Employee;

    if(permission.allowSelf === false){
      if(response = missingTargetEmployee("allowSelf")) return response;
      if(employee.id === targetEmployee.id)
        return fail('allowSelf');
    }
    if(permission.allowOthers === false){
      if(response = missingTargetEmployee("allowOthers")) return response;
      if(employee.id !== targetEmployee.id)
        return fail('allowOthers');
    }
    if(permission.requireBelow){
      if(response = missingTargetEmployee("requireBelow")) return response;

      // this is technically comparing the position, which includes window vs front counter,
      // however; all of the roles are on top, so it will work out
      if(employee.getHighestPositionIndex({ qualified: true })
        < targetEmployee.getHighestPositionIndex({ qualified: true }))
          return fail('requireBelow');
    }
    if(permission.allowGuest === false){
      if(this.isGuestSignedIn())
        return fail('allowGuest');
    }

    if(permission.requireRoles){
      if(employee.passesRoleList(permission.requireRoles))
        return pass();
      return fail('requireRoles');
    }else
      throw TypeError('requireRoles is required in a permission object');

    function missingTargetEmployee(requirement: string): HasPermissionResponse|never|false {
      if(targetEmployee)
        return false;

      const FAIL_SILENTLY = true;
      if(FAIL_SILENTLY)
        return fail('error');
      else
        throw TypeError(`[employee.hasPermission]: cannot ${requirement} without a targetEmployee`);
    }
    function pass(): HasPermissionResponse {
      return {
        allowed: true,
        name: permission && permission.name || "",
      };
    }
    function fail(failure: HasPermissionFailure): HasPermissionResponse {
      const out: HasPermissionResponse = {
        allowed: false,
        name: permission && permission.name || "",
        failure
      };
      if (failure === 'error') {
        console.log("Permission fail", out);
      }
      return out;
    }
  }
  can(activity: ActivityPermissionId, targetEmployee?: Employee): boolean {
    const employee = this._employee$.value;

    if (activity === 'useApplication' && this.isSuperUser()) {
      // Important so sidebar/business-selector will load even before super user chooses a business/employee
      return true;
    }

    // fail silently because this function can be called repeatedly from the template
    if (!employee) {
      return false;
    }

    const hasPermission = this.hasPermission(employee, activity, targetEmployee);
    return !!hasPermission.allowed;
  }
  async canWithRequest(activity: ActivityPermissionId, targetEmployee?: Employee): Promise<boolean> {
    const employee = this._employee$.value;

    if(!employee)
      throw Error('[authService.canWithRequest]: employee is not defined');

    const hasPermission = this.hasPermission(employee, activity, targetEmployee);
    if(hasPermission.allowed)
      return true;

    const guestEmployee = await this.guestSignIn();
    if(!guestEmployee)
      return false;

    const guestHasPermission = this.hasPermission(guestEmployee, activity, targetEmployee);
    if(guestHasPermission.allowed)
      return true;

    alert(`${guestEmployee.name} also doesn't have permission to ${guestHasPermission.name}`);
    return false;
  }

  async guestSignIn(): Promise<Employee|false> {
    // don't alert here because that would post errors about not being able to sign in as guest
    // when, for example, a trainer presses a button to view history.
    // errors in this circumstance should come from a place closer to the destination
    if(!this.can('guestSignIn'))
      return false;

    const userResponse = prompt('What is your sign-in PIN?', '');
    if(!userResponse)
      return false;

    const pin = parseInt(userResponse, 10);
    if(isNaN(pin))
      return false;

    const guestEmployee = await this._business$.value.employeeWithPin(pin);
    if (!guestEmployee) {
      alert('That PIN is invalid');
      return false;
    }

    if(!this.hasPermission(guestEmployee, "useApplication")){
      alert(`${guestEmployee.name} doesn't have permission to use the application`);
      return false;
    }

    this.tempEmployeeId$.next(guestEmployee.id);
    return guestEmployee;
  }
  guestActivity(activity: string): void {
    // Calling this function resets the auto-sign-out timer for the guests
    // It should be placed in higher-level actions to help detect
    // when the guest user (eg: trainer, manager) is actively working.
    // Examples: doing ratings, viewing the training profile, changing permissions

    // If I log this on some keystrokes of a rating, this could fire relatively frequently
    // It will be fired at least on most navagations to authenticated areas of the app

    if(!this.isGuestSignedIn())
      return;

    // TODO: log the activity as a telemetric
    // console.log(`Guest is doing this activity: ${activity}`);

    const guestId = this.tempEmployeeId$.value;
    this.tempEmployeeId$.next(guestId);
  }
  guestSignOut(silent?: boolean): void {
    // TODO: this can be handled on it's own with rxjs operators, but I don't know that they are
    // When a user manually signs out, the function will still run after the timer runs out too
    if(!this.tempEmployeeId$.value)
      return;

    this.tempEmployeeId$.next(undefined);

    /*
    // TODO: decide whether or not to totally remove this code, and if it needs a replacement
    // Alert after doing the math so that the logic is completed in case the user is gone when it alerts
    // If the guest presses a button to sign out, don't shout at them. (This may not be necessary)
    if(false && !silent)
      setTimeout(() => {
        // Do this inside a timeout so that the UI can update and revert to whatever state
        // before freezing at this alert.
        alert("You have been signed out. Sign back in as a guest to continue.");
      }, 200);
    /** ISSUE:
     * Having the alert in the timeout is causing problems when the guest signs out
     * when the app is busy with lots of load/CPU work going on. The sign-out process would
     * be cut short mid-process and never complete.
     *
     * Possible solutions include
     *  - Not giving any additional feedback and relying on the state of buttons and other objects
     *  - Sending it in a timeout later to allow the sign-out process to finish
     *  - Using my oc-modal service instead which would allow the thread to continue processing
     *    \-> This would also come with better styling, easier dismissal, and more custom controls
     *  - Sending the alert before beginning the sign-out process. This means that any UI changes will
     *    \-> not be reflected until after the alert is dimissed
     *  - Dad makes a good point. I may not need to tell them that they have been signed out because
     *    \-> the app does a good job of prompting for the sign-in and showing who is currently signed-in.
     * */
  }

  /**
   * Helper for setting cookies with some default settings.
   **/
  private setCookie(name: string, value: string) {
    // Set the expiration date of the cookie to 6 months from now
    // This will help with service accounts in the back.
    // Use 'Strict' for security and to get rid of a warning in chrome inspector.
    this.cookies.set(name, value, TimeService.add(6 * oneMonth), "/",
                       undefined, undefined, 'Strict');
  }

  changeToDestination(nextDestination: DestinationInfo) {
    this._requestDestination$.next(nextDestination.id);
  }
  switchBusinesses(businessId: BusinessId) {
    this._requestBusiness$.next(businessId);
  }

  async login(service: LoginProvider): Promise<any> {
    var provider;
    switch(service){
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      default:
        throw Error(`Provider ${service} is not recognized`);
    }

    try {
      return firebase.auth().signInWithPopup(provider);

      // let result = await firebase.auth().signInWithPopup(provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      // var token = result.credential;//.accessToken;
      // var user = result.user;
    }catch (error){
      throw Error(`${error.code}: ${error.message}`);
    };
  }
  private async signInWithUser(user: AuthUser): Promise<void> {
    var appUser = await this.appUserService.getOnce(user.uid);
    if(appUser){
      console.log(`Logged in as ${appUser.name}`);
    }else{
      let constructionObj: AppUserConstructionObj = {
        ref: this.appUserService.collection.doc(user.uid),

        email: user.email,
        name: user.displayName,
        emailVerified: user.emailVerified,
        profileUrl: user.photoURL,
        businesses: [],
      }
      appUser = new AppUser(constructionObj);
      await appUser.create();
      console.log(`Created user ${appUser.name}`);
    }

    let linked = await linkPendingAccounts(this.firestore.env.collection('pendingAccounts'), appUser);
    if(linked)
      console.log('Successfully linked Account to businesses');

    if (!appUser.businesses.length && !appUser.isSuperUser) {
      // TODO: send message to user
      alert(
        'Sorry, this email address is not yet associated with a store location. ' +
        'Ensure you login with your email as listed in HotSchedules. If your email is correct, ' +
        'then your account will be automatically linked soon, after which you may log in ' +
        'as normal.'
      );
      // Read: You're not invited in the club
    }

    this._user$.next(appUser);
    this.afterLogin();
  }
  private afterLogin(): void {
    // TODO: maybe allow the users to set a default page etc...
    const newUrl = this.redirectUrl || 'organizeShifts';
    this.redirectUrl = undefined;
    this.ngZone.run(() => this.router.navigateByUrl(newUrl));
  }

  logout(): Promise<void> {
    // do this first to give the appearance of a fast operation
    this.signOutOfUser();
    return firebase.auth().signOut();
  }
  private signOutOfUser(): void {
    this._user$.next(null);
    this.router.navigate(['/login']);
  }

  getUser(): AppUser|undefined|null {
    return this._user$.value;
  }
  getBusiness(): Business|undefined|null {
    return this._business$.value;
  }
  getEmployee(): Employee|undefined|null {
    return this._employee$.value;
  }
  getDestination(): Destination|undefined|null {
    return this._destination$.value;
  }

  generatePartialSubmittedBy(who: Employee): BasicEmployeeInformation
  generatePartialSubmittedBy(who: AppUser): BasicUserInformation
  generatePartialSubmittedBy(who: Employee|AppUser): BasicEmployeeInformation|BasicUserInformation {
    return {
      id: who.id,
      name: who.name,
      ...(who.profileUrl && {profileUrl: this.photoService.withDefault(who.profileUrl)}),
    }
  }
  generateSubmittedBy(): SubmittedBy {
    const fromEmployee = this.getEmployee(),
          fromUser = this.getUser();

    return {
      employee: this.generatePartialSubmittedBy(fromEmployee),
      user: this.generatePartialSubmittedBy(fromUser)
    };
  }
  generateBasicIdData(): BasicIdData {
    const business = this.getBusiness();
    if(!business)
      throw Error("[auth.service:generateBasicIdData] Cannot build without a business");

    const destination = this.getDestination();
    if(!destination)
      throw Error("[auth.service:generateBasicIdData] Cannot build without a business");

    return {
      destination: { id: destination.id, name: destination.name || "No destination name" },
      business: { id: business.id, name: destination.name || "No business name" },
      submittedBy: this.generateSubmittedBy(),
    }
  }
}

export interface HasPermissionResponse {
  allowed: boolean;
  name: string;
  failure?: HasPermissionFailure;
}

type HasPermissionFailure =
  "requireBelow" |
  "allowSelf" |
  "allowOthers" |
  "requireRoles" |
  "error" |
  "archived" |
  "allowGuest" |
  "businessPermission" |
  "businessPermissionExpired";
