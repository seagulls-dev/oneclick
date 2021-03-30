import { Injectable } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';

import { PickyCacheManager } from '../services/cache-manager-picky';
import { AppUser } from './app-user.model';

@Injectable({
  providedIn: 'root',
})
export class AppUserService extends PickyCacheManager<AppUser> {
  objConstructor = userDoc => new AppUser(userDoc);

  constructor(){
    super();
  }

  start(environmentRef: DocumentReference): void {
    this.collection = environmentRef.collection('users');
  }
}