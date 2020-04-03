import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthActions } from 'ionic-appauth';
import { skipWhile, take } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../storage.service';

@Component({
  templateUrl: './auth-callback.page.html'
})
export class AuthCallbackPage implements OnInit {

  error : boolean = false;
  errorText : string;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router,
    private route : ActivatedRoute,
    private storage : StorageService
  ) {
  }

  handleError(error) {
    this.error = true;
    this.errorText = JSON.stringify(error);
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
        console.log('route query params = ', params);
        if(Object.keys(params).length == 0) {
          this.handleError("No route params were provided to /implicit/callback");
        }
      });

    try {
      this.authService.AuthorizationCallBack(this.router.url);
      this.authService.authObservable
        .pipe(skipWhile(action => action.action !== AuthActions.SignInSuccess
          && action.action !== AuthActions.SignInFailed), take(1))
        .subscribe(async (action) => {
          if (action.action === AuthActions.SignInSuccess) {
            this.authService.setAuthenticated(true);
            const info = await this.authService.getUserInfo() as any;
            this.authService.userInfo.next({
              login: info.preferred_username || info.email,
              email: info.email || info.preferred_username,
              firstName: info.given_name,
              lastName: info.family_name,
            });

            let uri : string;
            try {
              uri = await this.storage.getItem('redirectUri') || '/';
            } catch(e) {
              console.warn(e);
              uri = '/';
            }
            console.log('uri = ', uri);
            try {
              this.storage.removeItem('redirectUri');
            } catch(e) {
              console.warn(e);
            }
            this.router.navigate([uri]);
          } else {
            this.authService.setAuthenticated(false);
            this.router.navigate(['/']);
          }
        },
        error => {
          this.handleError(error);
        });
    } catch(e) {
      console.warn(e);
      this.handleError(e);
    }
  }

}
