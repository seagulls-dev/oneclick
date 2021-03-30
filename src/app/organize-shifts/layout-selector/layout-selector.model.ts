import { Time } from '../time.service';

export interface LayoutSelector {
  readonly id: string; // LayoutId --> probably not required, just keeping for good measure
  time: Time;
}