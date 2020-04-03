import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { AuthService } from './auth/auth.service';
import { AudioService } from './services/audio.service';
import { ReminderService } from './services/reminder.service';
import { LocalStorageService } from './services/localstorage.service';
import { DarkmodeService } from './services/darkmode.service';
import { PreferencesService } from './services/preferences.service';
import { AnalyticsService } from './services/analytics.service';

import { UserPreferences } from './models/liturgy.model';
import LogRocket from 'logrocket';

import { Deploy } from 'cordova-plugin-ionic';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private reminders : ReminderService,
    private storage : LocalStorageService,
    private darkMode : DarkmodeService,
    private preferences : PreferencesService,
    private analytics : AnalyticsService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      LogRocket.init('qxpy7l/venite');

      // Hide Splash Screen
      if(this.platform.is('capacitor')) {
        SplashScreen.hide();
      }

      speechSynthesis.getVoices();

      this.authService.startUpAsync();

      this.darkMode.prefersDark.subscribe(prefersDark => document.body.classList.toggle('dark', prefersDark));

      // Analytics
      await this.analytics.startTracker('UA-157724803');
      if(this.platform.is('capacitor') && this.platform.is('ios')) {
        this.analytics.trackEvent('native-ios', 'Platform');
      } else if(this.platform.is('capacitor') && this.platform.is('android')) {
        this.analytics.trackEvent('native-android', 'Platform');
      } else if(this.platform.is('pwa') && this.platform.is('ios')) {
        this.analytics.trackEvent('pwa-ios', 'Platform');
      } else if(this.platform.is('pwa') && this.platform.is('android')) {
        this.analytics.trackEvent('pwa-android', 'Platform');
      } else if(this.platform.is('android')) {
        this.analytics.trackEvent('web-android', 'Platform');
      } else if(this.platform.is('ios')) {
        this.analytics.trackEvent('web-ios', 'Platform');
      } else {
        this.analytics.trackEvent('web-desktop', 'Platform');
      }

      // Set Dark Mode per preferences
      this.preferences.preferences.subscribe(prefs => this.darkMode.init(prefs));

      // surreptitiously re-randomize Bible verses on reminders whenever app loads
      if(this.platform.is('capacitor')) {
        const reminders = await this.storage.get('reminders');
        console.log(`re-randomizing reminders to ${JSON.stringify(reminders)}`);
        if(reminders && reminders.length > 0) {
          this.reminders.schedule(reminders);
        }
      }
    });


  }
}
