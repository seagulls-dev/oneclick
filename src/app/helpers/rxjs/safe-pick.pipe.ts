import { map } from 'rxjs/operators';

// similiar to pluck, that will fail silently when the property doesn't exist
export const safePick = (property: string) =>
  map((x): any|undefined =>
    (x && x[property] !== undefined) ? x[property] : undefined);