import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService } from '../../auth/storage.service';
import { IUserInfo } from '../../auth/user-info.model';
import { AuthActions } from 'ionic-appauth';
import { AuthService } from '../../auth/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'venite-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class AuthenticatedComponent implements OnInit {
  isAuth : boolean = false;

  constructor(
    public authService : AuthService,
    public storage : StorageService,
    public location : Location
  ) { }


  // Authentication Helpers
  signOut() {
    this.storage.clear();
    this.authService.signOut();
  }

  signIn() {
    this.storage.setItem('redirectUri', decodeURI(this.location.path()));
    this.authService.signIn().catch(error => console.error(`Sign in error: ${error}`));
  }

  public async getUserInfo(): Promise<IUserInfo> {
    return this.authService.getUserInfo<IUserInfo>();
  }

  public isAuthenticated() : boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    // load authentication info
    this.authService.authObservable.subscribe((action) => {
      console.log('[ACTION]', action);
      this.authService.setAction(action);
      this.authService.setAuthenticated(false);
      this.isAuth = false;
      if (action.action === AuthActions.SignInSuccess || action.action === AuthActions.AutoSignInSuccess) {
        this.authService.setAuthenticated(true);
        this.isAuth = true;
      }
    });

    this.isAuth = this.isAuthenticated();
  }

}
