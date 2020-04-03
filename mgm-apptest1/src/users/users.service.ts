import { Injectable, HttpService } from '@nestjs/common';
import { User, UserPreferences, Role, Group } from './user.model';

import { Client as OktaClient } from '@okta/okta-sdk-nodejs';
import * as OktaAuth from '@okta/okta-auth-js';
import * as OktaJwtVerifier from '@okta/jwt-verifier'

const OKTA_DOMAIN = 'https://login.venite.app';
const OKTA_APP_TOKEN = '00fyB6PFHpBZi1LuE4NVXNQ2dZWiWv9LnvpFnHkKzd';

const APPLE_CLIENT_ID = 'app.venite.login';
const APPLE_CLIENT_SECRET = 'eyJraWQiOiJHMlE2VEc5NlQ3IiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJTTDZLNTVTM1FZIiwiaWF0IjoxNTg0MzkzNjE5LCJleHAiOjE1OTk5NDU2MTksImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJhcHAudmVuaXRlIn0.nixr13RsnshFlGpgerz6Od8FI52R5xT24aN0faOFZLJdhHIFupWyb9JhZBl6eJrSX9MxmU1jWKuLYvqTGBzE2g';


const oktaClient = new OktaClient({
  orgUrl: OKTA_DOMAIN,
  token: OKTA_APP_TOKEN,
});

const oktaAuthClient = new OktaAuth({
  issuer: `${OKTA_DOMAIN}/oauth2/default`,
});

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `${OKTA_DOMAIN}/oauth2/default`
});

@Injectable()
export class UsersService {
  constructor(private http : HttpService) {}

  async setPreferences(login : string, prefs : UserPreferences) {
    let user = await oktaClient.getUser(login);
    user.profile.preferences = JSON.stringify(prefs);
    return await user.update();
  }

  async getPreferences(login : string) : Promise<UserPreferences> {
    let user = await oktaClient.getUser(login);
    return user.profile.preferences;
  }

  async getUser(login: string) : Promise<User> {
    let resp = await oktaClient.getUser(login);
    if(resp.profile.preferences) {
      resp.profile.preferences = JSON.parse(resp.profile.preferences);
    } else {
      resp.profile.preferences = {};
    }
    return resp.profile;
  }

  async getUsernameFromAccessToken(accessToken : string) : Promise<string> {
    let username : string;
    if(accessToken.includes('APPLE|')) {
      username = accessToken.split('APPLE|')[1];
    } else {
      try {
        let resp = await oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default');
        username = resp.claims.sub;
      } catch(e) {
        console.log(e);
        username = undefined;
      }
    }
    return username;
  }

  async getGroups(accessToken : string) : Promise<Group[]> {
    let username = await this.getUsernameFromAccessToken(accessToken);
    let resp = await this.http.get(`${OKTA_DOMAIN}/api/v1/users/${username}/groups`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `SSWS ${OKTA_APP_TOKEN}`
      }
    }).toPromise();
    if(resp.status == 200) {
      return resp.data;
    } else {
      console.log(resp);
      return [];
    }
  }

  async signInWithApple(newUser) {
    console.log(newUser);
    let currentUser;
    try {
      currentUser = await oktaClient.getUser(newUser.profile.login);
      if(currentUser && !currentUser.errorCode) {
        console.log('CurrentUser', currentUser);
      }
    } catch(e) {
      console.error('(Error)', e);
      currentUser = oktaClient.createUser(newUser);
      console.log('(Registered User)', currentUser);
    }

//    this.http.post('https://appleid.apple.com/auth/token',
//      {
//        grant_type: 'authorization_code',
//        code: newUser.authorizationCode,
//        client_id: APPLE_CLIENT_ID,
//        client_secret: APPLE_CLIENT_SECRET
//      },
//      {
//        headers: {
//          'Accept': 'application/json',
//          'User-Agent': 'curl'
//        }
//      }
//    ).subscribe(
//        resp => console.log('(registerAppleUser) (authCode) = ', resp),
//        e => console.error(e)
//      );
  }
}
