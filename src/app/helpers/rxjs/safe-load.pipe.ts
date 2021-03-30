import { of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// given an object with a load function which returns the original object,
// safeLoad waits for it to load and the emits, or emits immediately if no
interface Loadable<T> {
  load: () => Promise<T>;
}

/*
export const safeLoad<T extends Loadable<T>> = () =>
  switchMap((obj: T|null|undefined): Observable<T|null|undefined> => {
    return obj ? from(obj.load()) : of(obj) ;
  });
  */
export function safeLoad<T extends Loadable<T>>() {
  return switchMap((obj: T|undefined|null) => {
    return obj ? from(obj.load()) : of(obj) ;
  });
}