import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';
import firebase from '@firebase/app';
import { ReplaySubject } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { DayCollection } from '../organize-shifts/day.model';
import { DayService } from '../organize-shifts/day.service';
import { finishConstruction } from '../helpers/snippet';
import { Omit } from '../helpers/omit';

import { Position } from '../organize-shifts/layout.model';
import { List, ListCollection } from '../lists/list.model';
import { ListService } from '../lists/list.service';

export class Destination {
  private ref: DocumentReference;
  readonly id: DestinationId;

  // NOTE: the name and id fields must be duplicated in the destination's config file
  // These are also included as DestinationInfo[] on the business
  // They are apparently also kept in a config document in the business...
  // TODO: reduce all this redundancy, or figure out why I need all of it

  icon: string; // 'knife' from fa-knife
  name: string;
  abbreviation?: string;

  bonusPositions?: {[bonusPositionId: string]: BonusPosition};

  days$: ReplaySubject<DayCollection>|undefined;
  lists$: ReplaySubject<ListCollection>|undefined;

  constructor(
    destinationDoc: DocumentSnapshot,
    private configService: ConfigService,
    private dayService: DayService,
    private listService: ListService
  ){
    finishConstruction(this, destinationDoc);
  }

  load(): Promise<Destination> {
    let pending = [];

    pending.push(this.configService.init('destination', this.ref));
    pending.push(this.dayService.start(this.ref));
    pending.push(this.listService.start(this.ref));

    if(!this.days$)   this.days$ = this.dayService.get$();
    if(!this.lists$)   this.lists$ = this.listService.get$();

    return Promise.all(pending)
      .then(() => { return this });
  }
  unload(): void {
    console.warn(`Not unloading the destination ${this.name} in business ${this.ref.parent.parent.id}`);
  }

  createBonusPosition(position: BonusPositionInput): Promise<boolean> {
    if(!this.bonusPositions)
      this.bonusPositions = {};

    (position as BonusPosition).lastUsed = new Date;
    const bonusPosition = position as BonusPosition;

    // Save it locally
    this.bonusPositions[position.id] = bonusPosition;

    // Prepare to save remotely
    const updates: { [updatePath: string]: any } = {};
    updates[`bonusPositions.${position.id}`] = bonusPosition;

    return this.ref.update(updates)
    .then(() => true) // Success
    .catch(error => { throw new Error(error) });
  }
  deleteBonusPosition(position: BonusPositionInput): Promise<boolean> {
    if(!this.bonusPositions || !this.bonusPositions[position.id])
      return Promise.resolve(false); // The position didn't exist

    // Delete locally
    delete this.bonusPositions[position.id];

    // Prepare to delate remotely
    const updates: { [updatePath: string]: any } = {};
    updates[`bonusPositions.${position.id}`] = firebase.firestore.FieldValue.delete();

    return this.ref.update(updates)
    .then(() => true)
    .catch(error => {
      throw Error(error);
      return false;
    });
  }

  createList(title: string): Promise<void> {
    console.log(`Creating list ${title} in destination ${this.id} in business ${this.ref.parent.parent.id}`);
    return this.listService.createNew(title);
  }
}

export type DestinationId = string;
export interface DestinationCollection {
  [destinationId: string]: Destination;
}
export interface DestinationInfo {
  id: DestinationId;
  name: string;
  abbreviation?: string;
  icon: string; // 'knife' from fa-knife
}

export type BonusPositionInput = Omit<Position, "shifts">;
export type BonusPosition = BonusPositionInput & { lastUsed: Date };
