import { hsget } from '../login';


import { EmployeeRecord, JobRecord, RoleRecord, ScheduleRecord, ShiftRecord } from './HotSchedules.d';

export function getEmployees(allEmployees?: boolean): Promise<EmployeeRecord[]>{
  let url = `https://www.hotschedules.com/hs/spring/client/employee/${allEmployees ? '' : '?active=true' }`;
  return hsget(url);
}
export function getJobs(): Promise<JobRecord[]>{
  let url = 'https://www.hotschedules.com/hs/spring/client/jobs/';
  return hsget(url);
}
export function getRoles(): Promise<RoleRecord[]>{
  let url ='https://www.hotschedules.com/hs/spring/client/roles/';
  return hsget(url);
}
export function getSchedules(): Promise<ScheduleRecord[]>{
  let url = 'https://www.hotschedules.com/hs/spring/employee/1278789915/schedule';
  return hsget(url);
}
export function getShifts(startTimestamp: Date|number, endTimestamp: Date|number): Promise<ShiftRecord[]>{
  function formatForURL(timestamp){
    let date = new Date(timestamp);
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  }
  let startDate = formatForURL(startTimestamp),
      endDate = formatForURL(endTimestamp),
      url = `https://www.hotschedules.com/hs/spring/shifts/posted/?start=${startDate}&end=${endDate}`;
      // https://www.hotschedules.com/hs/spring/shifts/posted/?start=2019-04-29&end=2019-05-04&_=1546445550782

  return hsget(url);
}
