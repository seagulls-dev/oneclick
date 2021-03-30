import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import Firebase from '@firebase/app';
import '@firebase/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  /*
  private settings = {
    timestampsInSnapshots: true
  };
  */
  private config = {
    apiKey: 'AIzaSyA90Oipz_4GJQha7BbO_xPfLw1_rTdKDz8',
    authDomain: 'hotautoscheduler.firebaseapp.com',
    databaseURL: 'https://hotautoscheduler.firebaseio.com',
    projectId: 'hotautoscheduler',
    storageBucket: 'hotautoscheduler.appspot.com',
    messagingSenderId: '1064651513278'
  };

  readonly betaData: boolean;
  env: DocumentReference;
  version$ = new BehaviorSubject<string>(null);

  constructor(private router: Router) {
    const url = this.router.url;
    this.betaData = url.indexOf('dev') > -1;

    console.log(`Loading firestore service at url: ${url}\nBeta: ${this.betaData}`);

    this.betaData = true;
    console.warn('Manually entering betaData anyway');

    const firebase = Firebase.initializeApp(this.config);
    const db = firebase.firestore(); // .settings(this.settings);
    this.env = db.collection('environments').doc(this.betaData ? 'DEV' : 'PROD');

    this.env.onSnapshot(
      (doc) => {
        const newVersion = doc.get('version');
        if (!this.version$.value) {
          this.version$.next(newVersion);
        } else if (newVersion !== this.version$.value) {
          // Updating version signals a need to refresh the app, get new data
          console.log("App version changed. Reloading...");
          window.location.reload();
        }
      },
      (error) => {
        console.log('Env snapshot error', error);
      }
    );
  }
}

export type UpdatesObject = { [updatePath: string]: any };
