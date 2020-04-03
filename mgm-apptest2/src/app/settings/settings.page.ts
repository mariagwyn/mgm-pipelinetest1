import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PreferencesService } from '../services/preferences.service';
import { SpeechService } from '../services/speech.service';
import { RecipeService } from '../services/recipe.service';
import { DarkmodeService } from '../services/darkmode.service';
import { AuthService } from '../auth/auth.service';
import { UserPreferences, Liturgy } from '../models/liturgy.model';
import { ToastController } from '@ionic/angular';

import isoLangs from '../models/language-codes.json'; // @author Phil Teare using wikipedia data

@Component({
  selector: 'venite-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  prefs : UserPreferences = new UserPreferences();
  display : 'display'|'liturgy' = 'liturgy';

  // Display
  voicesWithNationalities : { voice: SpeechSynthesisVoice; nationality: string }[] = new Array();
  voiceChoices : SpeechSynthesisVoice[] = new Array();

  // liturgy
  menu : Liturgy[] = new Array();
  menuPrefs : { [x: string]: string[] } = {};

  constructor(
    private preferencesService : PreferencesService,
    private speechService : SpeechService,
    private authService : AuthService,
    private recipeService : RecipeService,
    private loading : LoadingController,
    private toast : ToastController,
    private darkmode : DarkmodeService
  ) { }

  async loadPrefs() {
    const loading = await this.loading.create({
      message: 'Loading...',
    });
    await loading.present();
    this.preferencesService.preferences.subscribe(prefs => {
      this.prefs = prefs;
      if(!this.prefs) {
        this.prefs = new UserPreferences();
      }
      loading.dismiss();
    });
  }

  languageName(code : string) : string {
    return isoLangs[code].name;
  }

  clearPreferences(liturgy : Liturgy) {
    delete this.prefs.preferences[liturgy.language][liturgy.version][liturgy.slug];
  }

  loadDefaultPreferences(liturgy : Liturgy) {
    // create path if not there
    this.prefs.preferences = this.prefs.preferences || {};
    this.prefs.preferences[liturgy.language] = this.prefs.preferences[liturgy.language] || {};
    this.prefs.preferences[liturgy.language][liturgy.version] = this.prefs.preferences[liturgy.language][liturgy.version] || {};
    this.prefs.preferences[liturgy.language][liturgy.version][liturgy.slug] = this.prefs.preferences[liturgy.language][liturgy.version][liturgy.slug] || {};

    Object.keys(liturgy.preferences).forEach(key => {
      this.prefs.preferences[liturgy.language][liturgy.version][liturgy.slug][key] = this.preferencesService.getDefaultPref(liturgy.preferences[key]);
    });
  }

  async savePreferences() {
    await this.preferencesService.setPreferences(this.prefs);
    const toast = await this.toast.create({
      message: 'Your preferences have been saved.',
      duration: 2000
    });
    toast.present();
    this.darkmode.init(this.prefs);
  }

  async ngOnInit() {
    this.loadPrefs();

    this.recipeService.getMenu()
      .subscribe(data => {
        this.menu = data;
        data.forEach(liturgy => {
          this.menuPrefs[liturgy.slug] = Object.keys(liturgy.preferences);
        });
      });

    this.speechService.init();
    this.speechService.getVoices().subscribe(voices => {
      this.voiceChoices = voices;

      this.voicesWithNationalities = this.voiceChoices.map(voice => {
        return { voice, nationality: this.speechService.getNationality(voice) };
      })
      .sort((a, b) => b.nationality < a.nationality ? 1 : -1);
    });
  }

}
