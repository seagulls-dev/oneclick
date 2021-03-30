import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';
import firebase from '@firebase/app';

import { Omit } from '../helpers/omit';

import { finishConstruction, DataObject } from '../helpers/snippet';
import { TimeService } from '../organize-shifts/time.service';

export class List {
  private ref: DocumentReference;
  readonly id: string;

  title: string;
  items: ListItemCollection;
  lastInteracted?: Date;

  constructor(listDocOrConstructionObject: DocumentSnapshot|ListConstructionObject) {
    finishConstruction(this, listDocOrConstructionObject);

    if(!this.items)
      this.items = {};
    else {
      const isNewDay = !this.lastInteracted ||
        TimeService.extractDay(this.lastInteracted) !== TimeService.extractDay(new Date);

      for(let itemId in this.items){
        this.items[itemId].id = itemId;
        if(isNewDay){
          this.items[itemId].done = false;
          this.items[itemId].rating = 0;
        }
      }
    }
  }

  create(): Promise<void> {
    const skipFields = 'ref,id'.split(',');
    let saveObj: { [fieldName: string]: any } = {};
    for(let fieldName in this)
      if (skipFields.indexOf(fieldName) === -1 &&
          typeof this[fieldName] !== 'function')
            saveObj[fieldName] = this[fieldName];

    console.log("Saving list", saveObj);

    return this.ref.set(saveObj);
  }
  deleteSelf(): Promise<void> {
    console.log(`Deleting list ${this.title}`);
    return this.ref.delete()
      .then(() => {})
  }

  private static getUpdatesObject(item: ListItem, doDelete?: boolean): object {
    // If value is left undefined, the item will be used
    let updates = {};

    let setValue;
    if(doDelete)
      setValue = firebase.firestore.FieldValue.delete();
    else {
      setValue = {};
      for(let key in item)
        if(key !== 'id')
          setValue[key] = item[key];
    }

    updates[`items.${item.id}`] = setValue;
    return updates;
  }
  private updateItem(item: ListItem, doDelete?: boolean): Promise<void> {
    let updates = List.getUpdatesObject(item, doDelete);
    updates['lastInteracted'] = firebase.firestore.FieldValue.serverTimestamp();

    // Create a new `items` reference for Angular ChangeDetection
    const items = {};
    for(let itemId in this.items)
      if(item.id !== itemId || !doDelete)
        items[itemId] = this.items[itemId];


    this.items = items;

    return this.ref.update(updates)
      // .then(() => console.log("Success"))
      .catch(error => {
        throw Error(`[list.model:updateItem] Error!` + error);
      })
  }

  addItem(title: string, description?: string): Promise<void> {
    const newItemId = this.ref.parent.doc().id;
    const newItem: ListItem = {
      title,
      description: description || "",
      id: newItemId,
      // done: false,
      // rating: 0,
    }

    // Local update
    this.items[newItemId] = newItem;

    return this.updateItem(newItem);
  }
  removeItem(item: ListItem): Promise<void> {
    if(!item || !this.items[item.id])
      return;

    this.items[item.id] = undefined;

    return this.updateItem(item, true);
  }
  toggleItemDone(item: ListItem): Promise<void> {
    if(!item || !this.items[item.id])
      return;

    this.items[item.id].done = !this.items[item.id].done;

    return this.updateItem(item);
  }
  rateItem(item: ListItem, rating: number): Promise<void> {
    if(!item || !this.items[item.id])
      return;

    if(rating < 1 || rating > 5)
      throw Error(`[list.model:rateItem] The value must be between 1 an 5`);

    this.items[item.id].rating = item.rating = rating;

    return this.updateItem(item);
  }
}
export interface ListCollection {
  [id: string]: List;
}


// The employees can mark the items as done,
// then a leader will give them a rating
export interface ListItem {
  id: string;
  title: string;
  description?: string;
  sort?: number;

  done?: boolean;
  rating?: number;
}
export interface ListItemCollection {
  [listItemId: string]: ListItem;
}

export interface ListConstructionObject extends DataObject {
  title: string;
  ref: DocumentReference;
}

export interface ListEvaluationResult {
  title: string;
  score: number;
  items: ListItemEvaluated[];
}
export type ListItemEvaluated = Omit<ListItem, "sort"|"done">;
