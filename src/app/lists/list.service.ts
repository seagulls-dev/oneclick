import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';
import { Injectable } from '@angular/core';
import { first, mapTo } from 'rxjs/operators';

import { GreedyCacheManager } from '../services/cache-manager-greedy';
import { ConfigService } from '../config/config.service';

import { List } from './list.model';

@Injectable({
  providedIn: 'root',
})
export class ListService extends GreedyCacheManager<List> {
  objConstructor = (listSnapshot: DocumentSnapshot): List => {
    return new List(listSnapshot);
  }
  objUpdater = (existingList: List, listSnapshot: DocumentSnapshot): List => {
    return new List(listSnapshot);
  }

  constructor(
    private configService: ConfigService,
  ) {
    super();
  }

  start(destinationRef: DocumentReference): Promise<void> {
    this.collection = destinationRef.collection('lists');

    this.subscribe();

    return this.get$().pipe(first(), mapTo(undefined)).toPromise();
  }

  createNew(title: string): Promise<void> {
    const newList = new List({
      title,
      ref: this.collection.doc()
    });

    return newList.create()
      .catch(error => {
        throw Error(`[list.service:createNew] Could not create new list with title '${title}'`);
      })
  }
}
