import { Injectable } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';
import { first, mapTo } from 'rxjs/operators';

import { GreedyCacheManager } from '../services/cache-manager-greedy';
import { Layout, LayoutCollection, LayoutConstructionObject } from './layout.model';
import { ConfigService } from '../config/config.service';
import { ShiftService } from './shift.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService extends GreedyCacheManager<Layout> {
  objConstructor = layoutSnapshot => new Layout(layoutSnapshot, this.configService, this.shiftService);

  constructor(
    private configService: ConfigService,
    private shiftService: ShiftService
  ){
    super();
  }

  start(dayDoc: DocumentReference): Promise<void> {
    this.collection = dayDoc.collection('layouts');
    this.subscribe();

    return this.get$().pipe(first(), mapTo(undefined)).toPromise();
  }

  create(time: Date): LayoutConstructionProgress {
    // don't make a new layout if one already exists at that time
    var layoutList: Layout[] = [],
        layouts: LayoutCollection = this.bin;
    for(let layoutId in layouts){
      let layout = layouts[layoutId];
      if(+layout.time === +time)
        return { error: `Did not make create layout because one already exists at ${time.toUTCString()}: (${layout.id})` };
      else
        layoutList.push(layout);
    }

    // sort these by time ascending
    layoutList.sort((a, b) => +a.time - +b.time);

    // create the new layout
    let constructionObject: LayoutConstructionObject = {
      time: time,
      ref: this.collection.doc(),
    },
        layout = new Layout(constructionObject, this.configService, this.shiftService);

    return {
      layout: layout,
      sortedExistingLayouts: layoutList,
    };
  }
}

export interface LayoutConstructionProgress {
  error?: string;
  layout?: Layout;
  sortedExistingLayouts?: Layout[]; // sorted ascending
}
