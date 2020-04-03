import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { UserPreferences, User, Preference } from '../models/liturgy.model';
import { LocalStorageService } from './localstorage.service'
import { AuthService } from '../auth/auth.service';
import { Profile } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  userInfo : Profile;
  public preferences : BehaviorSubject<UserPreferences> = new BehaviorSubject(new UserPreferences());
  currentPrefs : UserPreferences;

  constructor(
    private httpClient : HttpClient,
    private storage : LocalStorageService,
    private authService : AuthService
  ) {
    this.authService.userInfo.subscribe(info => {
      this.userInfo = info;
      this.loadPreferences();
    });
    this.preferences.subscribe(prefs => this.currentPrefs = prefs);
  }

  async loadPreferences() : Promise<void> {
    if(this.authService.isAuthenticated()) {
      let accessToken : string = await this.authService.getAccessToken();

      try {
        this.httpClient.get<UserPreferences>(`${API_URL}/user/preferences`, {
          headers: { 'Authorization': `bearer ${accessToken}`}
        }).subscribe(data => this.preferences.next(data));
      } catch(e) {
        console.warn('Error loading user preferences: ', e);
        this.preferences.next(JSON.parse(await this.storage.get('preferences')));
      }
    } else {
      let prefsString : string = await this.storage.get('preferences');
      if(prefsString) {
        this.preferences.next(JSON.parse(prefsString));
      } else {
        this.preferences.next(new UserPreferences());
      }
    }
  }

  async setPreferences(prefs : UserPreferences) : Promise<any> {
    this.preferences.next(prefs);
    this.storage.set('preferences', JSON.stringify(prefs)); // save locally
    console.log('stored local preferences');

    if(this.authService.isAuthenticated()) {
      let accessToken : string = await this.authService.getAccessToken();
      return this.httpClient.post<User>(`${API_URL}/user/preferences`, {
        preferences: prefs
      }, { headers: { 'Authorization': `bearer ${accessToken && accessToken !== '[APPLE]' ? accessToken : 'APPLE|'+this.userInfo.login}`}})
        .subscribe(data => {
          console.log('saved preferences: ', data);
        }); // save globally
    } else {
      console.log('not logged in to save preferences');

      return Promise.resolve(prefs);
    }
  }

  setPreference(key : string, value : any) {
    this.currentPrefs[key] = value;
    console.log('updated preferences: ', this.currentPrefs);
    this.setPreferences(this.currentPrefs);
  }

  getDefaultPref(preference : Preference) : string {
    if(preference) {
      let defaultPref = preference.options.filter(opt => opt.default)[0];
      let firstPref = preference.options[0];
      return (defaultPref || firstPref).value;
    } else {
      return undefined;
    }
  }
}
