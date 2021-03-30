import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, combineLatest, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private lastInteraction: Date;
  private currentTime: Time; // Will be interpreted in UTC
  private currentDay: Day;
  private realWeekNumber: number; //for comparing against the birthday weeks

  static extractDay(date: Date|number): Day {
    return new Date(Math.floor(+date / oneDay) * oneDay)
  }
  static extractTime(date: Date): Time {
    let time = +date % oneDay;
    return new Date(Math.floor(time / oneMinute) * oneMinute);
  }
  static extractUTCDay(date: Date): Day {
    let adjustedDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return adjustedDay;
  }
  static extractUTCTime(date: Date): Time {
    let adjustedTime = new Date(Date.UTC(1970, 0, 1, date.getHours(), date.getMinutes(), date.getSeconds()));
    return adjustedTime;
  }
  static UTCNow(): Date {
    const localNow = new Date;
    const utcNow = Date.UTC(
      localNow.getFullYear(),
      localNow.getMonth(),
      localNow.getDate(),
      localNow.getHours(),
      localNow.getMinutes(),
      localNow.getSeconds());
    return new Date(utcNow);
  }

  time$ = new ReplaySubject<Time>(1);
  day$ = new ReplaySubject<Day>(1);
  date$ = combineLatest(this.time$, this.day$).pipe(
    map(([time, day]) => {
      return {
        time: time,
        day: day,
        date: new Date(+time + +day),
      }
    })) as Observable<FullTime>;

  setDay(timestamp: Day): void {
    let oldDay = this.currentDay;
    this.currentDay = TimeService.extractDay(timestamp);

    if(+oldDay !== +this.currentDay)
      this.day$.next(this.currentDay);
  }
  setTime(timestamp: Time): void {
    let oldTime = this.currentTime;

    this.currentTime = TimeService.extractTime(timestamp);

    if(+oldTime !== +this.currentTime)
      this.time$.next(this.currentTime);
  }
  makeCurrentDay(): void {
    const UTCDate = TimeService.UTCNow();
    return this.setDay(UTCDate);
  }
  makeNow(): void {
    this.makeCurrentDay();
    this.setTime(TimeService.UTCNow());
  }
  isToday(timestamp?: Date|number): boolean {
    const UTCDate: Day =
      timestamp !== undefined ?
      TimeService.date(timestamp) :
      TimeService.UTCNow();

    return +TimeService.extractDay(UTCDate) === +this.currentDay;
  }

  static adjustBirthday(timestamp: Day): Date {
    // takes a birthday and returns a date object on the same day and month of the current year
    return new Date((new Date).getUTCFullYear(), timestamp.getUTCMonth(), timestamp.getUTCDate());
  }
  isThisRealWeek(timestamp: Day): boolean {
    // returns a boolean indicating if the date is actually found in the same calendar week as the computers clock (not the selected time of the days...)
    // this is used to show indicators for employees with birthdays in the current week
    let adjustedDate = TimeService.adjustBirthday(timestamp);
    let weekNumber = TimeService.getWeek(adjustedDate);
    return weekNumber === this.realWeekNumber;
  }

  static getWeek(date: Date): number {
    // This script is released to the public domain and may be used, modified and
    // distributed without restrictions. Attribution not necessary but appreciated.
    // Source: https://weeknumber.net/how-to/javascript

    // Returns the ISO week of the date.
    date = new Date(date.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 7) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 7) % 7) / 7);
  }
  static getWeekYear(date: Date): number {
    // Returns the four-digit year corresponding to the ISO week of the date.
    date = new Date(date.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 7) % 7);
    return date.getFullYear();
  }
  static getAbsoluteWeek(timestamp: Date): number {
    return TimeService.getWeekYear(timestamp) * 52 + TimeService.getWeek(timestamp);
    // return TimeService.date(timestamp).getFullYear() * 52 + TimeService.getWeek(timestamp);
  }

  static getUTCWeekDay(timestamp: Day): string {
    //inteprets a timestamp in UTC time and returns a string of the weekday.
    const weekday = timestamp.getUTCDay();
    switch(weekday){
      case 0: return "Sunday";
      case 1: return "Monday";
      case 2: return "Tuesday";
      case 3: return "Wednesday";
      case 4: return "Thursday";
      case 5: return "Friday";
      case 6: return "Saturday";
      default:
        throw Error(`Unrecognized weekday ${weekday} for timestamp ${timestamp}`);
    }
  }

  private static date(input?: Date | number): Date {
    if(input && 0 < input && input < 24)
      throw Error("input must be a Date or a full timestamp, not a shorthand hours format: " + input);

    return input ? new Date(input) : new Date();
  }
  static toHoursFormat(date: Date): number {
    // returns [0, 24) the hour part of the timestamp, interpreted in UTC time
    return (+date % oneDay) / oneHour;
  }
  static fromHoursFormat(n: number): Date {
    // returns a date given the time part in hours format [0, 24) with no day part
    return TimeService.date(n * oneHour);
  }
  static add(n1: number|Date, n2?: number|Date): Date {
    // If no value is provided, the current browser date will be used
    return TimeService.date(+TimeService.date(n1) + +TimeService.date(n2));
  }
  static timeFromNow(timestamp: number|Date, suppressAgo?: boolean): string {
    if (!timestamp) {
      return 'Never';
    }
    return moment(timestamp).fromNow(suppressAgo);
  }

  interact(func?: Function): void {
    this.lastInteraction = new Date;

    if(func)
      func();
  }

  constructor(private configService: ConfigService) {
    this.makeNow();
    this.interact();
  }

  private started = false;
  start(): void {
    // time service has already started.
    // Normal since I start it every time I load OrganizeShifts
    if(this.started)
      return;

    this.started = true;

    timer(0, 5000).subscribe(_x => {
      var interactIntervalMinutes = (+TimeService.date() - +this.lastInteraction) / oneMinute;

      this.realWeekNumber = TimeService.getWeek(new Date());

      // pull us to the current time
      if(this.isToday()){
        if(interactIntervalMinutes > this.configService.getConfig<number>('client.minMinutesBeforeAutoControl', 3))
          this.makeNow();
      } else if(interactIntervalMinutes > this.configService.getConfig<number>('client.minMinutesBeforeAutoControlWhenAway', 6))
          this.makeNow();
    });
  }
}

export const oneSecond  = 1000;
export const oneMinute = 1000*60;
export const oneHour = 1000*60*60;
export const oneDay = 1000*60*60*24;
export const oneWeek= 1000*60*60*24*7;
export const oneMonth = oneWeek * 4;

export const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const weekdayAbbreviations = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export type Time = Date; // In UTC time; Will be found on the first day since the epoch
export type Day = Date; // will have no time part in UTC time

export interface FullTime {
  time: Time;
  day: Day;
  date: Date;
}
