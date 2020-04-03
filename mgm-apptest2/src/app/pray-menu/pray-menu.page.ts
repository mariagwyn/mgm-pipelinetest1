import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { AuthService } from '../auth/auth.service';
import { PreferencesService } from '../services/preferences.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { StorageService } from '../auth/storage.service';

import { AuthenticatedComponent } from '../shared/authenticated/authenticated.component';

import { Observable } from 'rxjs';
import { Liturgy, Preferences, ClientPreferences, Preference, UserPreferences } from '../models/liturgy.model';
import isoLangs from '../models/language-codes.json'; // @author Phil Teare using wikipedia data

const READING_LABELS = {
  'first_reading': '“OT/First Reading”',
  'second_reading': '“Epistle/Second Reading”',
  'gospel': '“Gospel”'
}

const SPECIAL_DAYS = ['wednesday-last-epiphany', 'sunday-holy-week', 'thursday-holy-week', 'friday-holy-week', 'saturday-holy-week', 'sunday-easter'];
const SPECIAL_LITURGIES = ['ash_wednesday', 'palms', 'footwashing', 'good_friday', 'holy_saturday', 'easter_vigil'];

@Component({
  selector: 'venite-pray-menu',
  templateUrl: './pray-menu.page.html',
  styleUrls: ['./pray-menu.page.sass'],
})
export class PrayMenuPage extends AuthenticatedComponent {
  constructor(
    private recipeService : RecipeService,
    public authService : AuthService,
    private title : Title,
    private router : Router,
    private preferencesService : PreferencesService,
    private toast : ToastController,
    public storage : StorageService,
    public location : Location,
    public alert : AlertController
  ) {
    super(authService, storage, location);
    this.title.setTitle('Breviary - Venite');
  }

  error : string;

  menuObs : Observable<Liturgy[]>;
  menu : Liturgy[] = new Array();
  data : FormData;

  menuLangs : string[] = new Array();
  menuVers : string[] = new Array();
  menuLits : Liturgy[] = new Array();
  versPrefs : Preferences = new Preferences();

  userInfo : any;
  userPrefs : UserPreferences = new UserPreferences();

  hasSupplements : boolean = false;
  hasPreferences : boolean = false;

  dateIsSaturday : boolean = false;
  dateSpecialDay : string;

  dayReadings : { [x: string]: string[] } = {};

  hasStartedNavigating : boolean = false;

  versionLabels = {
    "Rite-I": "Traditional (Rite I/ASB)",
    "Rite-II": "Contemporary (Rite II)",
    "EOW": "Expansive (EOW et al)",
    "Daily-Devotions": "Brief (Daily Devotions for Individuals and Families)"
  }

  availableReadings : string[] = new Array();


  // Preference support
  getPreferences(menu : Liturgy[], version : string) : Preferences {
    let prefs = {};
    if(menu && menu.length > 0) {
      let liturgySlug : string = this.data.liturgy,
          liturgy : Liturgy = menu.find(l => l.slug == liturgySlug && l.version == version);
      if(liturgy) {
        prefs = liturgy.preferences;
      }
    }
    return prefs;
  }

  async savePreferences() {
    let language = this.data.language,
        version = this.data.version,
        liturgy = this.data.liturgy,
        prefs = this.data.preferences,
        currentPrefs = this.userPrefs,
        langObj = currentPrefs[language] || {},
        versionObj = langObj[version] || {},
        liturgyObj = versionObj[liturgy] || {};

    if(!currentPrefs.preferences) {
      currentPrefs.preferences = {};
    }
    //currentPrefs.preferences[language] = langObj;
    //currentPrefs.preferences[language][version] = versionObj;
    if(!currentPrefs.preferences[language]) {
      currentPrefs.preferences[language] = {};
    }
    if(!currentPrefs.preferences[language][version]) {
      currentPrefs.preferences[language][version] = {};
    }
    currentPrefs.preferences[language][version][liturgy] = prefs;
    currentPrefs.defaultLanguage = language;
    currentPrefs.defaultVersion = version;
    this.preferencesService.setPreferences(currentPrefs);
  }

  // When a new liturgy slug is chosen, set preferences to defaults
  getUserPref(prefs : UserPreferences, language : string, version : string, liturgy : string, pref : string) : string {
    if(prefs && prefs.preferences && prefs.preferences[language] && prefs.preferences[language][version] && prefs.preferences[language][version][liturgy]) {
      return prefs.preferences[language][version][liturgy][pref];
    } else {
      return undefined;
    }
  }

  async changeLiturgy(liturgySlug) {
    if(this.menu) {
      this.data.liturgy = liturgySlug;
      let liturgy : Liturgy = this.menu.find(l => (l.slug == liturgySlug && l.language == this.data.language && l.version == this.data.version));
      this.data.preferences = new ClientPreferences();
      if(liturgy) {
        for(let pref in liturgy.preferences) {
          let userPref = this.getUserPref(this.userPrefs, this.data.language, this.data.version, liturgySlug, pref);
          this.data.preferences[pref] = userPref || this.preferencesService.getDefaultPref(liturgy.preferences[pref]);
        }
      }
      this.versPrefs = this.getPreferences(this.menu, this.data.version);
      this.hasSupplements = !!Object.values(this.versPrefs).find(o => o.supplement);
      this.hasPreferences = !!Object.values(this.versPrefs).find(o => !o.supplement);
      this.dayChanged();
    }
  }

  // Hard-coded default liturgy slug for any given hour
  liturgyOfTheHour(now : Date) : string {
    let hour : number = now.getHours();
    if(hour > 3 && hour < 11) {
      return "morning_prayer"
    } else if(hour >= 11 && hour <= 14) {
      return "noonday_prayer"
    } else if(hour >= 14 && hour <= 20) {
      return "evening_prayer"
    } else {
      return "compline"
    }
  }

  // Date menu support
  daysInMonth(year : string, month : string) : number[] {
    let days = new Date(parseInt(year), parseInt(month), 0).getDate(),
        range = new Array();
    for(let ii = 1; ii <= days; ii++) {
      range.push(ii);
    }
    return range;
  }

  //
  menuLiturgies(language : string, version : string) : Liturgy[] {
    let ls = this.menu.filter(l => {
      return l.language == language && l.version == version
    })
    ls.forEach(l => l.special_day = SPECIAL_LITURGIES.includes(l.slug))
    return ls;
  }
  menuLiturgyOptions(language : string, version : string) : string[] {
    return this.menuLiturgies(language, version).map(l => l.slug);
  }
  menuLiturgyName(language : string, version : string, slug : string) {
    return this.menu.find(l => l.slug == slug)[0].name;
  }

  // setters
  setLanguage(event) {
    this.data.language = event.detail.value;
    this.menuVers = this.menuVersions(this.data.language);
    this.data.preferences = new ClientPreferences();
  }
  setVersion(event) {
    this.data.version = event.detail.value;
    this.menuLits = this.menuLiturgies(this.data.language, this.data.version);
    this.versPrefs = new Preferences();
    this.data.preferences = new ClientPreferences();
    this.changeLiturgy(this.liturgyOfTheHour(new Date()));
  }

  // Language menu support
  menuLanguages() : string[] {
    return this.menu.map(l => l.language)
            .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
  }

  languagelocalname(code : string) : string {
    return isoLangs[code]['nativeName'].split(',')[0];
  }

  // Version menu support
  menuVersions(language : string) : string[] {
    let versions : string[] = this.menu.map(l => l.language == language ? l.version : undefined)
      .filter(v => !!v)
      .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);;
    if(!versions.includes(this.data.version)) { // i.e., if you change languages
      this.data.version = versions[0];
    }
    return versions;
  }
  versionName(v : string) : string {
    return this.versionLabels[v] || v.replace(/-/g, ' ');
  }

  compareLiturgyFn(l1 : Liturgy, l2 : Liturgy) : boolean {
    return l1 && l2 ? l1.slug === l2.slug && l1.name === l2.name : l1 === l2;
  }

  // Check readings for liturgical day
  dayChanged() {
    let date = new Date();
    date.setFullYear(parseInt(this.data.y));
    date.setMonth(parseInt(this.data.m)-1);
    date.setDate(parseInt(this.data.d));
    this.dateIsSaturday = date.getDay() == 6;

    const dayReadingsKey = `${this.data.y}-${this.data.m}-${this.data.d}-${this.data.liturgy}`;
    if(!this.dayReadings[dayReadingsKey]) {
      this.dayReadings[dayReadingsKey] = new Array(); // block from pinging server againaa
      this.recipeService.getAvailableLectionaryReadings(
        this.data.y, this.data.m, this.data.d,
        this.data.liturgy, this.data.language || 'en', this.data.version || 'Rite-II'
      )
        .subscribe(
          data => {
            console.log('loaded readings = ', data);
            this.availableReadings = data.map(o => o.type)
              .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], []);
            this.dayReadings[dayReadingsKey] = this.availableReadings;
          },
          error => this.error = JSON.stringify(error)
        );
    } else {
      this.availableReadings = this.dayReadings[dayReadingsKey];
    }

    this.recipeService.getLiturgicalDay(this.data.y, this.data.m, this.data.d, new Date(), undefined, this.data.isVigil)
      .subscribe(
        data => {
          console.log('day selected = ', data);
          if(SPECIAL_DAYS.includes(data.slug)) {
            this.dateSpecialDay = data.slug;
          } else {
            this.dateSpecialDay = undefined;
          }
        },
        error => this.error = JSON.stringify(error)
      );
  }

  setSpecialDay(event, secondChoice : boolean = false) {
    const activated : boolean = event.detail.checked;
    if(this.dateSpecialDay == 'sunday-holy-week') {
      this.data.preferences['palms'] = activated ? 'before' : 'false';
    } else if(this.dateSpecialDay == 'thursday-holy-week') {
      this.data.preferences['footwashing'] = activated ? 'true' : 'false';
    } else if(this.dateSpecialDay == 'friday-holy-week') {
      this.data.liturgy = activated ? 'good_friday' : this.data.liturgy;
      this.changeLiturgy(this.data.liturgy)
    } else if(this.dateSpecialDay == 'saturday-holy-week') {
      this.data.liturgy = activated && !secondChoice ? 'holy_saturday' : this.data.liturgy;
      this.data.liturgy = activated && secondChoice ? 'easter_vigil' : this.data.liturgy;
      this.changeLiturgy(this.data.liturgy)
    } else if(this.dateSpecialDay == 'sunday-easter') {
      this.data.liturgy = activated ? 'easter_vigil' : this.data.liturgy;
      this.changeLiturgy(this.data.liturgy);
    } else if(this.dateSpecialDay == 'wednesday-last-epiphany') {
      this.data.liturgy = activated ? 'ash_wednesday' : this.data.liturgy;
      this.changeLiturgy(this.data.liturgy)
    }
  }

  // Core functions
  async pray(root : string, data : FormData) {
    let prayBroken : boolean = false;
    const readingPrefKeys = Object.keys(this.versPrefs).filter(p => ['readingA', 'readingB', 'readingC'].includes(p));
    let allReadingsAvailable : boolean = true;
    if(readingPrefKeys && readingPrefKeys.length > 0) {
      allReadingsAvailable = readingPrefKeys
       .filter(key => this.data.preferences[key].toLowerCase() !== 'none')
       .map(key => this.availableReadings.includes(this.data.preferences[key]))
       .reduce((a, b) => a && b);
    }

    if(!allReadingsAvailable) {
      const a : string[] = this.availableReadings.map(r => READING_LABELS[r]).filter(r => r && r !== ''),
            availableList : string = `${a.slice(0, -1).join(',')} or ${a.slice(-1)}`;

      const alert = await this.alert.create({
        header: 'Warning',
        message: `Not all the readings you’ve selected are available for that day. ${availableList} are available.`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          }, {
            text: 'Continue',
            handler: () => this.navigate(root, data)
          }
        ]
      });

      await alert.present();
    } else {
      this.navigate(root, data);
    }
  }


  navigate(root : string, data : FormData) {
    let commands : any[] = [root, data.language, data.version, data.y, data.m, data.d];

    this.hasStartedNavigating = true;
    this.savePreferences();

    let nonDefaultPrefs : ClientPreferences = {};
    if(data.liturgy && data.liturgy != "") {
      commands.push(data.liturgy); // add liturgy to URL params

      // determine which preferences have changed from defaults for that liturgy
      let preferences = this.menu.find(l => l.slug == data.liturgy && l.version == data.version).preferences;
      const uniquePrefKeys : string[] = Object.keys(this.versPrefs)
        .concat(Object.keys(this.data.preferences))
        .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], []);
      for(let key of uniquePrefKeys) {
        console.log(key);
        let liturgyPref = preferences[key],
            clientPrefValue = data.preferences[key],
            defaultPrefValue = this.preferencesService.getDefaultPref(liturgyPref);
        if(clientPrefValue !== defaultPrefValue) {
          nonDefaultPrefs[key] = clientPrefValue;
        }
      }

    }

    // if any prefs have changed, add them to URL params
    if((nonDefaultPrefs && Object.keys(nonDefaultPrefs).length > 0) || this.data.isVigil) {
      commands.push(JSON.stringify(nonDefaultPrefs));
    }


    if(this.data.isVigil) {
      commands.push('vigil');
    }

    this.router.navigate(commands);
  }

  clearPrefs() {
    this.userPrefs = new UserPreferences();
    this.savePreferences();
  }

  ionViewWillEnter() {
    this.refreshDates();
    this.hasStartedNavigating = false;
  }

  refreshDates() {
    if(!this.data) {
      this.data = new FormData();
    }
    let now : Date = new Date();
    this.data.y = now.getFullYear().toString();
    this.data.m = (now.getMonth()+1).toString();
    this.data.d = now.getDate().toString();
    this.data.liturgy = this.liturgyOfTheHour(now);
    this.changeLiturgy(this.data.liturgy);
    this.dayChanged();
  }

  async ngOnInit() {
    super.ngOnInit();

    // initial data values, before menu has async loaded
    this.refreshDates();
    this.data.preferences = new ClientPreferences();

    // load preferences first
    this.userPrefs = this.preferencesService.preferences.getValue();

    console.log('prepping menu...');
    // prep menu items
    this.menuObs = this.recipeService.getMenu();
    this.menuObs.subscribe(
      data => {
        this.menu = data;
        this.data.language = this.userPrefs ? (this.userPrefs.defaultLanguage || this.menuLanguages()[0]) : this.menuLanguages()[0];
        this.setLanguage({ detail: { value: this.data.language }});
        this.menuVers = this.menuVersions(this.data.language);
        this.data.version = this.userPrefs ? (this.userPrefs.defaultVersion || this.menuVers[0]) : this.menuVers[0];
        this.setVersion({ detail: { value: this.data.version }});
        this.menuLits = this.menuLiturgies(this.data.language, this.data.version);
        this.changeLiturgy(this.data.liturgy);
      },
      async error => {
        console.error(error);
        this.error = JSON.stringify(error);
      }
    );

    this.menuVers = this.menuVersions(this.data.language);
    console.log('ngOnInit menuVers = ', this.menuVers);
    this.menuLits = this.menuLiturgies(this.data.language, this.data.version);
    this.changeLiturgy(this.data.liturgy);

    if(this.isAuthenticated()) {
      this.userInfo = this.authService.getUserInfo();
    }
  }
}

class FormData {
  language?: string;
  version?: string;
  y: string;
  m: string;
  d: string;
  liturgy?: string;
  preferences: ClientPreferences;
  isVigil: boolean = false;
}
