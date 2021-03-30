import { Day } from '../day.model';

export interface WeekGroup {
  title: string;
  sortValue: number;
  days: Day[];
}

export interface WeekGroupLabel {
  weeksOut: number;
  value: string;
}
