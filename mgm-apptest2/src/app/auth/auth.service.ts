import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';
import { IonicAuth, IonicAuthorizationRequestHandler } from 'ionic-appauth';
import { BrowserService } from './browser.service';
import { CordovaRequestorService } from './cordova-requestor.service';
import { SecureStorageService } from './secure-storage.service';
import { StorageService } from './storage.service';
import { RequestorService } from './requestor.service';
import { Plugins, AppUrlOpen } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { AppleSigninComponent } from './apple-signin/apple-signin.component';

const { App } = Plugins;

import { HttpClient } from '@angular/common/http';
import { IAuthAction, AuthActionBuilder } from 'ionic-appauth';
import { TokenResponse } from '@openid/appauth'
import { Group, Profile } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends IonicAuth {
  authenticationState : BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAuth : boolean = false;
  action: IAuthAction;
  userInfo : BehaviorSubject<Profile> = new BehaviorSubject(undefined);


  // My code
  public isAuthenticated() : boolean {
    return this.isAuth;
  }
  public setAuthenticated(value : boolean) : void {
    this.isAuth = value;
    this.authenticationState.next(value);
  }
  public async getGroups() : Promise<Group[]> {
    let accessToken = this.getAccessToken();
    return this.http.get<any[]>(`${environment.apiUrl}/user/groups`, { headers: { 'Authorization': `bearer ${accessToken}`}}).toPromise();
  }
  public async hasContentAdminAccess() : Promise<boolean> {
    let groups = await this.getGroups(),
        names : string[] = groups.map(group => group.profile.name);
    return names.includes('Content');
  }
  public getAccessToken() : string {
    let s : string;
    try {
      s = this.isAuthenticated() ? this.action.tokenResponse.accessToken : undefined;
    } catch(e) {
      console.error(e);
      this.signIn();
    }
    return s;
  }
  public setAction(action : IAuthAction) {
    this.action = action;
  }
  public getAction() : IAuthAction {
    return this.action;
  }

  // @oktadev/schematics code
  constructor(
    requestor: RequestorService,
    cordovaRequestor: CordovaRequestorService,
    storage: StorageService,
    private secureStorage: SecureStorageService,
    public browser: BrowserService,
    private platform: Platform,
    private ngZone: NgZone,
    private http : HttpClient,
    private modal : ModalController
  ) {

      super((platform.is('mobile') && !platform.is('mobileweb')) ? browser : undefined,
        (platform.is('mobile') && !platform.is('mobileweb')) ? secureStorage : storage,
        (platform.is('mobile') && !platform.is('mobileweb') && platform.is('ios')) ? cordovaRequestor : requestor,
        undefined, undefined,
        (platform.is('mobile') && !platform.is('mobileweb')) ?
          new IonicAuthorizationRequestHandler(browser, secureStorage) :
          new IonicAuthorizationRequestHandler(browser, storage)
      );

      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        App.addListener('appUrlOpen', (data: AppUrlOpen) => {
          this.ngZone.run(() => {
            this.handleCallback(data.url);
          });
        });
        console.log('\n\n\n\n\nAdded listener appUrlOpen');
      }
    this.addConfig();
  }

  public async signIn() {
    if(this.platform.is('ios') && this.platform.is('capacitor')) {
      const modal = await this.modal.create({
        component: AppleSigninComponent
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      console.log(`Modal data = ${JSON.stringify(data)}`);
      if(!data) {
        return this.signInWithoutApple();
      } else {
        console.log(`Posting data: ${data}`);
        this.authSubject.next(AuthActionBuilder.SignInSuccess(new TokenResponse({
          access_token: '[APPLE]',
          id_token: data.identityToken
        })));
        this.userInfo.next({
          login: data.login,
          email: data.email,
          firstName: data.fullName.givenName,
          lastName: data.fullName.familyName,
        });
        this.http.post<any>(`${environment.apiUrl}/user/signInWithApple`, data)
          .subscribe(
            d => console.log(JSON.stringify(d)),
            error => console.error(JSON.stringify(error))
          );
        return Promise.resolve();
      }
    } else {
      return this.signInWithoutApple();
    }
  }

  public async signInWithoutApple() {
    super.signIn();
  }

  public async startUpAsync() {
    super.startUpAsync();
  }

  private onDevice(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  private async addConfig() {
    const scopes = 'openid profile offline_access';
    const redirectUri = this.onDevice() ? 'app.venite:/implicit/callback' : `${environment.baseUrl}/implicit/callback`;
    const logoutRedirectUri = this.onDevice() ? 'app.venite:/implicit/logout' : `${environment.baseUrl}/implicit/logout`;
    const clientId = '0oa2qa9oty6uPAQK8357';
    const issuer = 'https://login.venite.app/oauth2/default';
    const authConfig: any = {
      identity_client: clientId,
      identity_server: issuer,
      redirect_url: redirectUri,
      end_session_redirect_url: logoutRedirectUri,
      scopes,
      usePkce: true,
    };

    this.authConfig = {...authConfig};
  }

  private handleCallback(callbackUrl: string): void {
    console.log(`\n\n\nHandling callback: ${callbackUrl}`);
    if ((callbackUrl).indexOf(this.authConfig.redirect_url) === 0) {
      this.AuthorizationCallBack(callbackUrl).catch((error: string) => {
        console.error(`Authorization callback failed! ${error}`);
      });
    }

    if ((callbackUrl).indexOf(this.authConfig.end_session_redirect_url) === 0) {
      this.EndSessionCallBack().catch((error: string) => {
        console.error(`End session callback failed! ${error}`);
      });
    }
  }
}
