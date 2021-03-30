import { Shift } from '../shift.model';

function test(a: Shift, b: Shift, testId: string, time: Date, asc?: boolean): number {
  // ascending means the property sorts closer to the top
  let value: number;
  switch(testId){
    case 'goneHome':
    case 'training':
    case 'timeIn':
    case 'timeOut':
    case 'closing':
    case 'shiftLeader':
    case 'prep':
      value = +a[testId] - +b[testId];
      break;
    case 'name':
      value = a.owner && b.owner && a.owner.name.localeCompare(b.owner.name) || 0;
      break;
    case 'job':
      // TODO: Sort these from highest to lowest, but I don't have a way to do that
      // This will at least group similar jobs together.

      // Don't allow this to be reversed since it's pure alphebetical
      // Later, when they're in order, we'll allow it to be reversed as expected

      return a.job.localeCompare(b.job) || 0;
      break;
    case 'qualifiedPosition':
    case 'unqualifiedPosition':
      let qualified = testId === 'qualifiedPosition';
      value = a.owner && b.owner && a.owner.getHighestPositionIndex({qualified}) - b.owner.getHighestPositionIndex({qualified}) || 0;
      break;
    case 'alreadyOff':
      const aIsOff = +a.timeOut <= +time;
      const bIsOff = +b.timeOut <= +time;
      value = +aIsOff - +bIsOff;
      break;
    case 'onBreak':
      const aOnBreak = a.goneOnBreak instanceof Date;
      const bOnBreak = a.goneOnBreak instanceof Date;

      if(aOnBreak && bOnBreak)
        value = +b.goneOnBreak - +a.goneOnBreak;
      else
        value = +a.goneOnBreak - +b.goneOnBreak;

      break;
    default:
      throw Error('Unrecognized testId: ' + testId);
  }

  return asc ? value*-1 : value;
}

export default function sortShifts(scheduled: boolean, shifts: Shift[], time: Date): Shift[] {
  return shifts.sort((a, b) => {
    if(scheduled){
      return 0 ||
        check('goneHome') ||
        check('alreadyOff', true) ||
        check('onBreak', true) ||
        check('shiftLeader', true) ||
        check('timeOut') ||
        check('prep', true) ||
        check('training', true) ||
        check('timeIn') ||
        check('qualifiedPosition') ||
        check('unqualifiedPosition') ||
        check('job') ||
        check('name') ||
        1;
    } else {
      return 0 ||
        check('goneHome') ||
        check('alreadyOff', true) ||
        check('onBreak', true) ||
        check('shiftLeader', true) ||
        check('training') ||
        check('qualifiedPosition', true) ||
        check('unqualifiedPosition', true) ||
        check('job', true) ||
        check('closing', true) ||
        check('timeOut', true) ||
        check('timeIn') ||
        check('name') ||
        1;
    }

    function check(testId: string, onTop?: boolean): number {
      return test(a, b, testId, time, onTop);
    }
  });
}
