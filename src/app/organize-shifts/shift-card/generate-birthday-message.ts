import { TimeService, weekdayAbbreviations } from '../time.service';

export interface BirthdayObject {
  isToday: boolean;
  dayAbbreviation?: string; // Mo, Tu, We, Th, Fr, Sa, Su
    // ^^ this will always exist when the birthday is not today
};
export function generateBirthdayObject(birthday: Date): BirthdayObject {
  const adjustedBirthday = TimeService.extractUTCDay(TimeService.adjustBirthday(birthday));
  const today = TimeService.extractUTCDay(new Date);

  if(+adjustedBirthday === +today)
    return { isToday: true };

  return {
    isToday: false,
    // I could use the time pipe with moment.js to generate this label, but this will be more performant
    dayAbbreviation: weekdayAbbreviations[adjustedBirthday.getUTCDay()],
  }
}
