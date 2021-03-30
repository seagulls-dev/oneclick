import { DocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { CacheManager, Bin } from './cache-manager';

export abstract class PickyCacheManager<T> extends CacheManager<T> {
  protected bin: { [id: string]: ReplaySubject<T | undefined> };

  private dataChanged$ = new ReplaySubject<Bin>(1);
  get$(id: string): ReplaySubject<T | undefined> {
    this.subscribeToDocument(id);
    return this.bin[id];
  }
  getOnce(id: string): Promise<T | undefined>{
    return this.getDocumentOnce(id);
  }
  getAll$(): ReplaySubject<Bin> {
    this.subscribe();
    return this.dataChanged$;
  }

  private getCache(id: string): T|undefined {
    if(!this.bin[id])
      return;

    // TODO: refactor. use some other hack. I feel like this will be slow and ineffecient

    var state = 'Initiated', cachedData;

    this.bin[id].pipe(first()).subscribe(data => {
      if(false && state === 'Missing Data')
        console.warn(`[PickyCacheManager] data arrived late:`, data);
        // will throw second if things go wrong

      state = 'Found Data';

      cachedData = data;
    });

    if(false && state === 'Initiated'){
      console.warn(`[PickyCacheManager] first pipe operator didn't run synchronously. Missing data`);
      // will throw first
      state = 'Missing Data';
    }

    return cachedData;
  }
  private createReplaySubject(id: string): void {
    if(!this.bin[id])
      this.bin[id] = new ReplaySubject(1);
  }
  private handleNewData(task:'update'|'delete', doc: DocumentSnapshot): T | undefined {
    let id = doc.ref.id,
        oldObj = this.getCache(id);

    if(task === 'update'){
      let obj = this.buildObj(oldObj, doc);
      this.createReplaySubject(id);
      this.bin[id].next(obj);
      return obj;
    }else if(task === 'delete'){
      this.stopObj(oldObj, id);
      return undefined;
    }else
      throw Error('[PickyCacheManager.handleNewData] unrecognized task: ' + task);
  }

  protected subscribeToDocument(docId: string): void {
    if(!this.collection)
      throw Error("collection is not yet defined on the Picky Cache Manager");

    if(!docId)
      throw Error(`cannot subscribeToDocument because docId doesn't exist`);

    // only subscribe to a document once
    if(this.bin[docId])
      return;

    // so it initially exists
    this.createReplaySubject(docId);

    let unsubscribe = this.collection.doc(docId).onSnapshot(
      (doc: DocumentSnapshot) => this.handleNewData(doc.exists ? 'update' : 'delete', doc),
      this.onError);
    this.unsubscribeFuncs.push(unsubscribe);
  }
  protected getDocumentOnce(docId: string): Promise<T | undefined> {
    if(!this.collection)    throw Error("collection is not yet defined on the Picky Cache Manager");
    if(!docId)              throw Error(`cannot subscribeToDocument because docId doesn't exist`);

    return new Promise((resolve, reject) => {
      this.createReplaySubject(docId);

      this.collection.doc(docId).get()
      .then(doc => this.handleNewData(doc.exists ? 'update' : 'delete', doc))
      .then(obj => resolve(obj))
      .catch(error => {
        this.onError(error);
        reject(error);
      });
    });
  }

  private subscribed = false;
  protected subscribe(): void {
    let watch = this.query || this.collection;
    if(!watch)
      throw Error("A watch reference has not yet been set for this service");

    // only establish a listener once
    if(this.subscribed)
      return;

    this.subscribed = true;

    var unsubscribe = watch.onSnapshot((querySnapshot: QuerySnapshot) => {
      for(let change of querySnapshot.docChanges())
        this.handleNewData(change.type === 'removed' ? 'delete' : 'update', change.doc);

      // create a new reference to the data for Angular's sake,
      // and get the cached valued from each ReplaySubject
      let data = {};
      for(let key in this.bin)
        data[key] = this.getCache(key);
      this.dataChanged$.next(data);
    }, this.onError);
    this.unsubscribeFuncs.push(unsubscribe);
  }

  stop(deleteData?: boolean): void {
    this.subscribed = false;
    this.dataChanged$.complete();

    super.stop(deleteData);
  }
  removeItem(id: string): void {
    const oldObj: T = (this.bin[id] as any)._events[0];
    this.stopObj(oldObj, id);
  }
  deleteObj(oldObj: T, id: string): void {
    this.bin[id].next(undefined);

    // if we queried a document that never existed, we can't go around throwing errors
    if(this.bin[id]){
      this.bin[id].complete();
      delete this.bin[id];
    }
  }
}
