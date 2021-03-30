import { DocumentReference, Query, QuerySnapshot, CollectionReference } from '@firebase/firestore-types';
import { ReplaySubject } from 'rxjs';

import { CacheManager, Bin } from './cache-manager';

export abstract class GreedyCacheManager<T> extends CacheManager<T> {
  protected dataChanged$ = new ReplaySubject<Bin>(1);
  get$(): ReplaySubject<Bin> {
    return this.dataChanged$;
  }
  getCache(): Bin {
    return this.bin;
  }

  protected bin: { [id: string]: T };

  // returned Promise resolves after an initial batch of data has been laoded
  abstract start(watch: CollectionReference|DocumentReference): Promise<void>;

  private subscribed = false;
  protected subscribe(): void {
    let watch = this.query || this.collection;
    if(!watch)
      throw Error("A watch reference has not yet been set for this service");

    // Only subscribe to a listener once
    if(this.subscribed)
      return;

    this.subscribed = true;

    var unsubscribe = watch.onSnapshot((querySnapshot: QuerySnapshot) => {
      for(let change of querySnapshot.docChanges()){
        let doc = change.doc,
            id = doc.ref.id;
        if(change.type === 'removed'){
          let oldObj = this.bin[id]
          this.stopObj(oldObj, id);
        }else{
          let oldObj = this.bin[id];
          let obj = this.buildObj(oldObj, doc);
          this.bin[id] = obj;
        }
      }

      // create a new reference to the data for Angular's sake
      let data = {};
      for(let key in this.bin)
        data[key] = this.bin[key];
      this.dataChanged$.next(data);
    }, this.onError);
    this.unsubscribeFuncs.push(unsubscribe);
  }

  stop(): void {
    console.log("Stopping something");
    this.subscribed = false;
    this.dataChanged$.complete();
    super.stop();
  }
}
