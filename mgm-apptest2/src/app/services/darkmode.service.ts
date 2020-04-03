import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PreferencesService } from './preferences.service';
import { AlertController } from '@ionic/angular';
import { UserPreferences } from '../models/liturgy.model';

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {
  public prefersDark : BehaviorSubject<boolean> = new BehaviorSubject(false);
  public modeIsAuto : boolean = true;
  public deviceIsDark : boolean = false;

  constructor(private preferences : PreferencesService, private alert: AlertController) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addListener(async mediaQuery => {
      this.deviceIsDark = mediaQuery.matches;
      if(this.modeIsAuto) {
        this.toggleDarkTheme(this.deviceIsDark);
      } else {
        const alert = await this.alert.create({
          header: 'Dark Mode',
          message: `It looks like your device switched to ${this.deviceIsDark ? 'Dark Mode' : 'Light Mode'}. If you want Venite to respond, go to Settings and set the Display Mode to “Auto.”`,
          buttons: ['OK']
        });

        await alert.present();
      }
    })

    this.init();
  }

  async init(prefs : UserPreferences = undefined) {
    this.preferences.preferences.subscribe(loadedPrefs => {
      const userPrefs = prefs || loadedPrefs;

      console.log('(DarkmodeService) (init) ', prefs);

      if(userPrefs && userPrefs.displaySettings && userPrefs.displaySettings.displayMode && ['light', 'dark'].includes(userPrefs.displaySettings.displayMode)) {
        this.modeIsAuto = false;
        console.log('modeIsAuto', this.modeIsAuto);
        this.toggleDarkTheme(userPrefs.displaySettings.displayMode == 'dark')
      } else {
        this.modeIsAuto = true;
        this.toggleDarkTheme(this.deviceIsDark);
      }
    });
  }

  toggleDarkTheme(shouldAdd : boolean) {
    this.prefersDark.next(shouldAdd);
    //document.body.classList.toggle('dark', shouldAdd);
  }
}
