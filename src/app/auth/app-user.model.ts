import { DocumentReference, DocumentSnapshot, FieldValue } from '@firebase/firestore-types';
import firebase from '@firebase/app';

import { DbUser, EmployeeIdentifier } from '../../../database/db-user.model';
import { finishConstruction } from '../helpers/snippet';
import { Omit } from '../helpers/omit';
import { EmployeeId } from '../services/employee.model';

// TODO: code duplicated from database/db-user.model.ts
// find a better way to include these typings!
export class AppUser {
  private ref: DocumentReference;
  readonly id: UserId;

  email: string;
  name: string;
  emailVerified: boolean;
  profileUrl: string;

  // True if user is allowed to access the demo store
  isDemoStoreUser?: boolean;
  isSuperUser?: EmployeeId; // A reference to a super employee that will be created For us execs ;)

  joined: Date;
  businesses: EmployeeIdentifier[];
  // the first eid in the list is the default
  // These can be rearranged according to preference

  private isConstructionObj(arg: DocumentSnapshot | AppUserConstructionObj): arg is AppUserConstructionObj {
    return (<AppUserConstructionObj>arg).name !== undefined;
  }
  constructor(docOrConstructionObj: DocumentSnapshot | AppUserConstructionObj){
    if(this.isConstructionObj(docOrConstructionObj)){
      let constructionObj = docOrConstructionObj;
      this.ref = constructionObj.ref;
      this.id = this.ref.id;

      for(let prop in constructionObj)
        if(this[prop] === undefined)
          this[prop] = constructionObj[prop];
    } else {
      let appUserDoc = docOrConstructionObj;

      finishConstruction(this, appUserDoc);
    }
  }

  create(): Promise<void> {
    let setData: Omit<DbUser, "joined"> & { joined: FieldValue } = {
      email: this.email,
      name: this.name,
      emailVerified: this.emailVerified,
      profileUrl: this.profileUrl,
      businesses: this.businesses,

      joined: firebase.firestore.FieldValue.serverTimestamp(),
    }
    return this.ref.set(setData);
  }
  addBusinesses(businesses: EmployeeIdentifier[]): Promise<void> {
    if(!businesses.length)
      return Promise.resolve();

    // locally add for quick response
    this.businesses.splice(0, 0, ...businesses);

    return this.ref.update({
      businesses: firebase.firestore.FieldValue.arrayUnion.apply(null, businesses),
    })
    .catch(error => { throw Error('[app-user.addBusinesses]:' + error) });
  }
}

export interface BasicUserInformation {
  id: UserId;
  name: string;
  profileUrl?: string;
}

export type UserId = string;

export type AppUserConstructionObj = Omit<DbUser, 'joined'> & {
  ref: DocumentReference;
}
