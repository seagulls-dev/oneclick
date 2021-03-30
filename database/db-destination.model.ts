import { BonusPosition } from '../src/app/services/destination.model';
import { Day } from '../src/app/organize-shifts/time.service';
import { Collection } from './database.model';
import { Config } from '../src/app/config/config.model';
import { List } from '../src/app/lists/list.model';

export class DbDestination {
  lists: Collection<List>;
  days: Collection<Day>;

  config: Config; // Note: it's a collection of config stuff

  bonusPositions?: {[bonusPositionId: string]: BonusPosition};

  // NOTE: the name and id fields must be duplicated in the destination's config file
  // These are also included as DestinationInfo[] on the business
  // They are apparently also kept in a config document in the business...
  // TODO: reduce all this redundancy, or figure out why I need all of it

  // Note: the destination must contain a field so it appears in the results,
  // but I may or may not actually be using these fields.
  // TODO: cleanup my storage of destination information
  name: string;
  icon?: string;
  abbreviation?: string;
}
