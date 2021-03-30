import { Employee } from '../../services/employee.model';
import { htmlString } from '../../services/employee-ratings.model';
import { Position } from '../../organize-shifts/layout.model';

export interface Hint {
  // This information will be used to deep link to the employee
  // profile open to the correct position rating form
  // I'll also use this to show profile pictures to jog memories
  employee: Employee;
  position: Position;

  // This will be used to style and sort the hints
  // 1 is low and the priority increases with importance
  priority: number;

  color: string; // Default: 'grey'
  icon: string; // the FontAwesome name of an icon
  code: number; // Unique to each message type. Hundred's digit = priority
  title?: string;
  message: htmlString;
  /**
   * The name and position will be bolded for emphasis
   *
   * Each of these will be evaluated only for shifts assigned to the schedule
   * This means that they carry more weight because they actually worked or
   * will actually work in the position
   *
   * The rating age describes the minimum age of the most recent
   * rating on that position. This is used to help cycle the data,
   * keeping it up to date and preventing duplicate ratings.
   *
   * Assume that 1 month = 4 weeks
   *
   *
   * Priority 4:
   * 403 *name* is new here! How is (s)he on *position*? (rating age: 1 week)
   * 402 How did the scheduled training go with *name* on *position*? (rating age: 1 week)
   * 401 Looks like *name* learned a new position! How is (s)he on *position*? (Missing rating when there isn't a higher position nor leadership)
   *
   * Priority 3:
   * 302 Missing rating: How is *name* on *position*? (Missing rating in any case: leaders/non-leaders)
   * 301 Outdated rating: How is *name* on *position*? (NEVER if they are superGood; then: rating age: 6 months, leaders excluded; rating age: 12 months, leaders included)
   *
   * Priority 2:
   * 201 Low rating: Has *name* improved on *position*? (rating age: 1 month, unqualified rating)
   * 202 Possible improvement: Has *name* improved on *position* since working the rushes? (rating age: 3 months, qualified rating during a rush)
   *
   * Priority 1: consider hiding
   * 101 Shortcut: How was *name* on *position*? (rating age: 1 week)
   *
   * */
}
