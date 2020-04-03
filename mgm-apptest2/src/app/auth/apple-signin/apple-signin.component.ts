import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

@Component({
  selector: 'venite-apple-signin',
  templateUrl: './apple-signin.component.html',
  styleUrls: ['./apple-signin.component.sass'],
})
export class AppleSigninComponent implements OnInit {
  error : string;

  constructor(
    private modal : ModalController,
    private signInWithApple : SignInWithApple
  ) { }

  ngOnInit() {}

  async withApple() {
    try {
      const appleCredential: AppleSignInResponse = await this.signInWithApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      });
      //const credential = new firebase.auth.OAuthProvider('apple.com').credential(
      //
      //);
      //const response = await this.afAuth.auth.signInWithCredential(credential);
      console.log(`Login successful: ${JSON.stringify(appleCredential)}`);
      this.modal.dismiss(appleCredential)
    } catch (error) {
      console.log(error);
      this.error = JSON.stringify(error);
    }
  }

  withoutApple() {
    this.modal.dismiss(null);
  }

  dismiss() {
    this.modal.dismiss('CANCEL');
  }

}
