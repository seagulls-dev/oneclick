export interface EmployeeRecord {
  // https://www.hotschedules.com/hs/spring/client/employee/?active=true

  id: EmployeeId;
  name: string;
  type: 0; //actually zero
  visible: boolean;
  homeClientId: ClientId;
  international: boolean;
  refId: number;
  firstname: string;
  lastname: string;
  nickname: string;
  imagePath: string | null;
  birthDate: number; //UTC timestamp
  contactNumber: ContactNumber;
  address: {
    streetAddr1: string,
    streetAddr2: string,
    city: string,
    state: string,
    zipCode: string,
    country: null,
  };
  schedules: ScheduleId[];
  primaryJobId: number;
  sendSms: boolean;
  email: string;
  hireDate: number; //UTC timestamp
  salaried: boolean;
  hrId: number;
  emailConfirmed: boolean;
}
export interface ContactNumber {
  international: boolean;
  countryCode: string;
  areaCode: number;
  prefix: number;
  number: number;
  formatted: string; // (000) 000-0000
  type: string;
}
export interface ShiftRecord {
  // https://www.hotschedules.com/hs/spring/shifts/posted/?start=2019-04-29&end=2019-05-04&_=1546445550782

  operationId: 0; //actually zero
  id: number; //an 8 digit, NEGATIVE number
  ownerId: EmployeeId; //this corresponds to the employee id's
  startDate: string; // "yyy-mm-dd"
  startTime: string; // "hh:mm"
  duration: number; //presumably minutes of the shift
  jobId: JobId; //this probably corresponds to 'FOH General' etc
  roleId: number; //dunno what this represents
  locationId: -1;
  house: boolean;
  ovtHours: number; // 0.0
  regPay: 0; //actually zero, I guess this data isn't really included
  ovtPay: 0; // ^^ ditto
  clientId: ClientId;
  special: boolean;
  totalCost: number; //this isn't zero, it might be dollars or something ??
  specialEventId: null;
  mbpBreaks: []; // empty array
  reason: null; //probably used when trading shifts etc...
  reasonType: null;
  temporary: boolean;
}
export interface ScheduleRecord {
  // https://www.hotschedules.com/hs/spring/employee/1278789915/schedule?_=1556821335293

  scheduleId: ScheduleId,
  scheduleName: string, //Front of House
  assigned: boolean,
  disabled: boolean,
}
export interface ClientRecord {
  // https://www.hotschedules.com/hs/spring/my/clients?_=1546717043965

  id: ClientId;
  clientName: string;
  idmStoreName: null;
  externalRef: number;
  inactive: boolean;
  externalRefAlpha: string;
  workWeekStartId: number;
  currency: string;
  streetAddr1: string;
  streetAddr2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  telephone: string;
  email: string;
  web: string;
  timeZone: string;
  advanceNoticePeriod: 0; //actually zero
}
export interface LoggedInUserRecord {
  // crap! I didn't grab the url

  employeeId: EmployeeId;
  clientId: ClientId;
  type: number; // 1
  startDate: null;
  endDate: null;
}
export interface RoleRecord {
  // https://www.hotschedules.com/hs/spring/client/roles/?_=1546717048367

  id: RoleId;
  catId: number;
  orgId: number;
  roleName: string; //Leadership, Marketing etc
  sortOrder: number;
  disabled: boolean;
  externalRef: -1;
  sharedRef: 1;
  groupLevelDisabled: boolean;
}
export interface JobRecord {
  // https://www.hotschedules.com/hs/spring/client/jobs/?_=1546717048367

  id: JobId;
  orgId: number;
  jobName: string; //Leadership, FOH General etc...
  payRate: number; // 0.0
  otType: number;
  otValue: number; // 0.0
  externalRef: number;
  sortOrder: number;
  disabled: boolean;
  defaultScheduleId: ScheduleId;
  shortName: string;
  hscPayrateExclude: boolean;
  blended: boolean;
  groupLevelDisabled: boolean;
}

export type ClientId = number; //identifies a business
export type EmployeeId = number; //8 digit number that is actually a string
export type ScheduleId = number; //correspond to 'Front of House'...
export type JobId = number; //corresponds to 'FOH General'...
export type RoleId = number; //can't tell you ;)
