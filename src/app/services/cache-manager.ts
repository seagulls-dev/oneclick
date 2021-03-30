import { DocumentReference, DocumentSnapshot, CollectionReference, Query } from '@firebase/firestore-types';
import { EventEmitter } from '@angular/core';

// export type
export type Bin = { [id: string]: any };

export abstract class CacheManager<T> {
  collection: CollectionReference;
  query?: Query; // can be used to narrow the getAll operation to only some...

  abstract objConstructor: (doc: DocumentSnapshot) => T;
  objUpdater?: (existingObj: T, doc: DocumentSnapshot) => T;
  objDeleter?: (existingObj: T) => void;

  protected error$ = new EventEmitter<any>();

  protected abstract bin: Bin = {};
  protected unsubscribeFuncs: (() => void)[] = [];

  abstract start(watch: CollectionReference|DocumentReference): void;
  stop(deleteData?: boolean): void {
    for(let unsubscibeFunc of this.unsubscribeFuncs)
      unsubscibeFunc();

    this.unsubscribeFuncs = [];

    // stop all the objects within the service if they can be
    for(let objId in this.bin)
      this.stopObj(this.bin[objId], deleteData ? objId : false);

    const itemsLeft = Object.keys(this.bin).length;
    if(deleteData && itemsLeft)
      console.warn(`[cache-manager:stop] We tried and failed to delete all the items. We still have ${itemsLeft} objects left!`);
  }
  removeItem(id: string): void {
    this.stopObj(this.bin[id], id);
  }

  protected buildObj(oldObj: T|undefined, doc: DocumentSnapshot): T {
    if(oldObj && this.objUpdater)
      return this.objUpdater(oldObj, doc);
    else
      return this.objConstructor(doc);

    // reserve the actual data save to the next abstraction
  }
  protected stopObj(oldObj: T & Partial<Stoppable>, deleteOldObjId?: string|false): void {
    // if `deleteOldObjId` is truthy, the data will be deleted as well
    // Check to call `stop` or `unload` functions

    if(oldObj && typeof oldObj.stop === 'function')
      oldObj.stop(!!deleteOldObjId);
    if(oldObj && typeof oldObj.unload === 'function')
      oldObj.unload(!!deleteOldObjId);

    // NOTE: We don't *always* want to delete the data when it stops
    // because then I would have to redownload it when it's needed again
    // this would make switching days highly intensive and expensive

    // This allows another CacheManager to override this behaviour
    if(deleteOldObjId)
      this.deleteObj(oldObj, deleteOldObjId);
  }
  deleteObj(oldObj: T, id: string): void {
    if(this.objDeleter)
      this.objDeleter(oldObj);

    delete this.bin[id];
  }

  protected onError(error: any): void {
    // When the user signs out, this reference no longer exists
    // When this is the case, we don't care about the errors either
    // because they will be user-signed-out errors ;)
    if(this.error$){
      this.error$.emit(error);
      throw Error(error);
    }
  }
}

type Stoppable = {
  stop?: (deleteData?: boolean) => void;
  unload?: (deleteData?: boolean) => void;
}
