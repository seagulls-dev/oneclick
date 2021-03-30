import { Component, OnInit } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/auth';

import * as firebaseui from 'firebaseui';

import { TitleService } from '../services/title.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'oc-login',
  templateUrl: './login.component.html',
  styleUrls: [
    // './firebaseui.css',
    // '../../../node_modules/firebaseui/dist/firebaseui.css',
    './login.component.scss',
  ]
})
export class LoginComponent implements OnInit {
  constructor(public authService: AuthService, private titleService: TitleService) { }

  ngOnInit(){
    this.setTitle();

    // FirebaseUI config.
    var uiConfig: firebaseui.auth.Config = {
      // signInSuccessUrl: 'organizeShifts',
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          console.log('signInSuccessWithAuthResult: '+redirectUrl);
          return false; // this firebase listener will notice the auth state change
          // this.authService.signInWithUser(authResult);
        }
      },
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      ],
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      signInFlow: 'popup',
      // Terms of service url/callback.
      tosUrl: 'https://www.foryour.team/terms-conditions',
      // Privacy policy url/callback.
      privacyPolicyUrl: 'https://www.foryour.team/privacy-policy',
    };

    // If the login screen is displayed several times, we need to keep this instance
    // of the AuthUi. This might happen if the user signs in/out several times
    // I can't store it in the component because that will be deleted when I need
    // to persist this information.
    if(!this.authService.authUiInstance)
      this.authService.authUiInstance = new firebaseui.auth.AuthUI(firebase.auth());

    // Initialize the FirebaseUI Widget using Firebase.
    // The start method will wait until the DOM is loaded.
    this.authService.authUiInstance.start('#firebaseui-auth-container', uiConfig);
  }

  setTitle(): void {
    this.titleService.set('Member Login');
  }
}
