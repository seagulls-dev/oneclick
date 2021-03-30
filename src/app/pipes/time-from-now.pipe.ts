import { Pipe, PipeTransform } from '@angular/core';
import { oneMinute, TimeService } from '../organize-shifts/time.service';

@Pipe({
  name: 'timeFromNow',
  pure: false,
})
export class TimeFromNowPipe implements PipeTransform {
  private lastEvaluation: Date;
  private cachedResult: string;
  // We're going to assume that the property, suppressAgo, doesn't change; it will stay the same for it's context

  private MAX_CACHE_MINUTES = 15;

  constructor() {}

  // Since this is an expensive operation, cache results to save computation
  transform(timestamp: number, suppressAgo?: boolean, cacheFirst?: boolean): string {
    var that = this;

    // If we haven't yet evaluated the result, or if the last result wasn't quite right
    if(!this.lastEvaluation || this.cachedResult === "Invalid date" || this.cachedResult === 'Never')
      return evaluate();

    const now = new Date;

    // if the value was evaluated in this minute, keep the cache
    // if the value was evaluated more than x minutes ago, evaluate
    const minutesSinceLastEvaluation = (+now - +this.lastEvaluation) / oneMinute;
    if(minutesSinceLastEvaluation <= 1)
      return this.cachedResult;
    if(minutesSinceLastEvaluation > this.MAX_CACHE_MINUTES)
      return evaluate();

    // if the timestamp is old, keep the cache because it won't change frequently
    // if the timestamp is recent, check it every minute
    const minutesAgo = (+now - +timestamp) / oneMinute;
    if(minutesAgo > 60)
      return this.cachedResult;
    if(minutesAgo < this.MAX_CACHE_MINUTES && minutesSinceLastEvaluation >= 1)
      return evaluate();

    // No reason to evaluate?? I can't think of a reason to evaluate here...
    return this.cachedResult;

    // Use an arrow function in inheret `this` from the parent
    function evaluate(): string {
      that.lastEvaluation = new Date;
      that.cachedResult = TimeService.timeFromNow(timestamp, suppressAgo);
      return that.cachedResult;
    }
  }
}
