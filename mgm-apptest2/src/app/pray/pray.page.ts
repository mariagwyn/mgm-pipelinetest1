import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { CompiledLiturgy, UserPreferences, LiturgyObject } from '../models/liturgy.model';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DisplaySettings } from '../models/display-settings.model';
import { Favorite } from '../models/favorite.model';
import { SettingsComponent } from '../shared/settings/settings.component';
import { CopyBulletinLinkComponent } from '../shared/copy-bulletin-link/copy-bulletin-link.component';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { PlanService } from '../services/plan.service';
import { SpeechService } from '../services/speech.service';
import { PreferencesService } from '../services/preferences.service';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../auth/auth.service';
import { SelectionService } from '../services/selection.service';
import { BulletinService } from '../services/bulletin.service';
import { Bulletin } from '../models/bulletin.model';
import { SelectedTextEvent } from '../models/selection.model';

import { MediaControlsService } from '../services/mediacontrols.service';
import { DarkmodeService } from '../services/darkmode.service';
import { AnalyticsService } from '../services/analytics.service';

import { faFileWord } from '@fortawesome/free-solid-svg-icons';

import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

@Component({
  selector: 'venite-pray-page',
  templateUrl: './pray.page.html',
  styleUrls: ['./pray.page.sass']
})
export class PrayPage implements OnInit {
  obj$ : Observable<CompiledLiturgy>;
  obj : CompiledLiturgy;
  y : string;
  m : string;
  d : string;
  liturgy : string;
  prefs : any;
  language : string;
  version : string;
  isVigil : boolean = false;

  canDownloadWord : boolean = false;

  settings: DisplaySettings = new DisplaySettings();
  settingsString : string = '';

  speechPlaying : boolean = false;
  speechPaused : boolean = false;

  error : string;
  audioText : string;

  // voices
  voiceLangPreference : string = 'en-IE';
  voiceChoices : SpeechSynthesisVoice[];
  voiceChoice : string;
  mediaControlsEnabled : boolean = false;

  // analytics
  timeStarted : Date;

  // FontAwesome icons
  faFileWord = faFileWord;

  // selections (favorites and sharing);
  selection : SelectedTextEvent;
  canUndoSelect : Subject<boolean>;
  canRedoSelect : Subject<boolean>;
  sharingEnabled : boolean;
  favoriteMarked : boolean = false;

  listeners : any[] = new Array();

  // allow for asynchronous Bible readings/other liturgy to load
  hasPending : boolean = false;

  isBulletin : boolean = false;
  loadedBulletin : Bulletin;
  bulletinDraftId : string;
  hasCreatedDraftBulletin : boolean = false;
  bulletinDraftNotFound : boolean = false;

  constructor(
    public recipeService : RecipeService,
    public route : ActivatedRoute,
    public location : Location,
    public title : Title,
    public planService : PlanService,
    public speechService : SpeechService,
    public favoriteService : FavoriteService,
    public popoverController : PopoverController,
    public analytics : AnalyticsService,
    public preferencesService : PreferencesService,
    public authService : AuthService,
    public selectionService : SelectionService,
    public zone : NgZone,
    public toast : ToastController,
    public controls : MediaControlsService,
    public darkmode : DarkmodeService,
    public bulletin : BulletinService,
    public router : Router,
    public actionsheet : ActionSheetController
  ) {
  }

  // Prayer init
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

  async ngOnInit() {
    this.initControls();
    this.initLiturgyFromParams(true);
    this.initSelectionService();
    await this.initDisplaySettings();
    this.initSpeechService();
  }

  initControls() {
    this.canDownloadWord = !!URL.createObjectURL;
    this.mediaControlsEnabled = this.controls.isAvailable();
  }

  async initLiturgyFromParams(rotate : boolean, bulletinLoader : boolean = false) {
    this.route.params.subscribe(async params => {
      if(params.bulletinID) {
        // praying a bulletin from shared link
        this.isBulletin = true;
        this.bulletin.readBulletin(parseInt(params.bulletinID)).subscribe(
          data => {
            this.loadedBulletin = data;
            this.obj = data.liturgy;
            this.settings = data.settings;
            console.log('(PrayPage ngOnInit) bulletin = ', data);
            this.processSettings();
            this.analytics.trackEvent(`bulletin-${params.bulletinID}-${this.language}-${this.version}-${this.liturgy}`, 'PrayBulletin');
          },
          async error => {
            console.error(error);
            this.error = JSON.stringify(error);
          }
        );
      } else if(params.uid && bulletinLoader) {
        // editing a draft bulletin
        this.bulletinDraftId = params.uid;
        try {
          const data = await this.bulletin.loadDraft(params.uid);
          if(!data) {
            this.bulletinDraftNotFound = true;
          } else {
            this.bulletinDraftNotFound = false;
            this.obj = data.liturgy;
            this.settings = data.settings;
            this.processSettings();
            this.analytics.trackEvent(`bulletin-draft-${params.uid}-${this.language}-${this.version}-${this.liturgy}`, 'PrayBulletin');
          }
        } catch(e) {
          console.error(e);
          this.error = JSON.stringify(e);
        }
      } else {
        // Load liturgy
        let date : Date = new Date();

        this.y = params.y || date.getFullYear().toString();
        this.m = params.m || (date.getMonth()+1).toString();
        this.d = params.d || date.getDate().toString();
        this.liturgy =  params.liturgy || this.liturgyOfTheHour(date);
        this.prefs = JSON.parse(params.prefs || '{}');
        this.language = params.language || 'en';
        this.version = params.version || 'Rite-II';
        this.isVigil = params.vigil && params.vigil == 'vigil';

        this.analytics.trackEvent(`${this.language}-${this.version}-${this.liturgy}`, 'PrayOffice');

        // Load liturgy
        this.obj$ = this.recipeService.getData(
          this.y, this.m, this.d, this.liturgy,
          this.prefs, this.language, this.version,
          rotate, this.isVigil
        );

        this.obj$.subscribe(async data => {
          if(bulletinLoader && !this.hasCreatedDraftBulletin) {
            // if bulletinLoader and regular URL, then we want to generate a new bulletin ID and
            this.hasCreatedDraftBulletin = true;
            const uid : string = await this.bulletin.newDraft(data, this.settings);
            this.router.navigate(['/', 'bulletin', uid, 'edit']);
          }

          this.title.setTitle(`${data.name} - ${params.m}/${params.d}/${params.y} - Venite`);
          this.checkForPending(data);
          this.timeStarted = new Date();
          this.language = data.language;
          this.version = data.version;

          // only scroll to fragment after
          // 1) liturgy is loaded
          // 2) a timeout (to insert after the render cycle)
          this.route.fragment.subscribe((fragment) => {
            if(fragment) {
              setTimeout(() => {
                let el = document.getElementById(fragment);
                if(el) {
                  el.scrollIntoView();
                }
              }, 1);
            }
          });
        },
        async error => {
          console.error(error);
          this.error = JSON.stringify(error);
        });
      }

      // Init text-to-speech
    });
  }

  initSelectionService() {
    // Subscribe to selections (for sharing and favorites)
    this.selectionService.selections().subscribe(data => {
      this.selection = data;
      this.favoriteMarked = false;
    });
    this.sharingEnabled = this.canShare();
    this.canUndoSelect = this.selectionService.undoable();
    this.canRedoSelect = this.selectionService.redoable();
  }

  async initDisplaySettings() {
    // Display Settings
    if(!this.isBulletin) {
      this.preferencesService.preferences.subscribe(prefs => {
        if(prefs && prefs.displaySettings) {
          let settings = new DisplaySettings();
          settings.dropcaps = prefs.displaySettings.dropcaps;
          settings.response = prefs.displaySettings.response;
          settings.repeatAntiphon = prefs.displaySettings.repeatAntiphon;
          settings.fontscale = prefs.displaySettings.fontscale;
          settings.font = prefs.displaySettings.font;
          settings.voiceChoice = prefs.displaySettings.voiceChoice;
          settings.voiceRate = prefs.displaySettings.voiceRate;
          settings.voiceBackground = prefs.displaySettings.voiceBackground;
          settings.psalmVerses = prefs.displaySettings.psalmVerses;
          settings.meditationBell = prefs.displaySettings.meditationBell;
          settings.displayMode = prefs.displaySettings.displayMode;
          this.settings = settings;
        } else {
          this.settings = new DisplaySettings();
        }
        this.processSettings(false);
      });
    }
  }

  initSpeechService() {
    this.speechService.init();
    this.speechService.getVoices().subscribe(voices => {
      this.voiceChoices = voices.filter(voice => voice && voice.lang && voice.lang.split('-')[0] == (this.language || 'en'));
      let voice = this.voiceChoices.find(voice => {
        if(this.settings) {
          return voice.name == this.settings.voiceChoice;
        } else {
          return voice.lang == this.voiceLangPreference;
        }
      });
      console.log(voice);
      if(!voice) {
        voice = this.voiceChoices.find(voice => voice && voice.lang && voice.lang.split('-')[0] == (this.voiceLangPreference || 'en-UK').split('-')[0]);
      }
      let name = voice.name;
      this.speechService.setVoice(name);
      this.speechService.setRate(this.settings.voiceRate);
    });
  }

  // Action Sheet
  async actionMenu() {
    let buttons : any[] = [
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ];
    if(this.voiceChoices && !this.speechPlaying && !this.hasPending) {
      buttons.push({
        text: 'Read Aloud',
        icon: 'headset',
        handler: () => this.speak()
      })
    }
    if(this.canDownloadWord && !this.hasPending) {
      buttons.push({
        text: 'Open in Word',
        icon: 'document',
        handler: () => this.convertToDocx(this.obj)
      });
    }
    if(this.isBulletin && !this.bulletinDraftId) {
      buttons.push({
        text: 'Bookmark this Bulletin',
        icon: 'bookmark',
        handler: async () => {
          this.bulletin.bookmarkBulletin(this.loadedBulletin).then(async () => {
            const toast = await this.toast.create({
              message: 'The bulletin has been bookmarked and will appear in the Bulletins page.',
              duration: 2000
            });
            toast.present();
          });
        }
      });
    }
    buttons = buttons.concat([
      {
        text: 'Show Settings',
        icon: 'settings',
        handler: () => {
          this.actionsheet.dismiss();
          this.showSettings();
        }
      },
      {
        text: 'Share Bulletin Link',
        icon: 'link',
        handler: () => {
          this.actionsheet.dismiss();
          this.saveBulletin();
        }
      }
    ])
    const actionSheet = await this.actionsheet.create({
      header: 'Actions',
      buttons
    });
    await actionSheet.present();
  }

  // Display setitings
  async showSettings() {
    const modal = await this.popoverController.create({
      component: SettingsComponent,
      backdropDismiss: true,
      componentProps: {
        'settings': this.settings,
        'voiceChoices': this.voiceChoices,
        'backgroundEnabled': this.speechService.canPlayBackground()
      }
    });
    modal.present();
    this.analytics.trackEvent(`${this.language}-${this.version}-${this.liturgy}`, 'ShowDisplaySettings');

    modal.onDidDismiss()
      .then(o => this.processSettings());
  }

  async processSettings(saveSettings : boolean = true) {
    console.log('new settings: ', this.settings);
    this.settingsString = `dropcaps-${this.settings.dropcaps} response-${this.settings.response} repeat-antiphon-${this.settings.repeatAntiphon} fontscale-${this.settings.fontscale.toString()} font-${this.settings.font} psalmverses-${this.settings.psalmVerses} bibleverses-${this.settings.bibleVerses}`;
    this.voiceChoice = this.settings.voiceChoice;
    this.speechService.setVoice(this.settings.voiceChoice);
    this.speechService.setRate(this.settings.voiceRate);
    this.speechService.setBackground(this.settings.voiceBackground);
    this.speechService.setBackgroundVolume(this.settings.voiceBackgroundVolume);
    const mockPrefs = new UserPreferences();
    mockPrefs.displaySettings = this.settings;
    this.darkmode.init(mockPrefs);
    if(saveSettings) {
      this.preferencesService.setPreference('displaySettings', this.settings);
    }
  }

  // Audio
  setVoice(event) {
    this.speechService.setVoice(event.detail.value);
    this.speechService.cancel();
    this.speechPaused = false;
    this.speechPlaying = false;
  }

  scrollTo(obj : LiturgyObject) {
    document.getElementById(obj.uid).scrollIntoView();
  }

  async initMediaControls() {
    if(this.mediaControlsEnabled) {
      try {
        this.controls.init({
          artist: 'Venite',
          track: this.obj.name,
          album: this.obj.name,
          isPlaying   : true,                         // optional, default : true
          dismissable : false,                         // optional, default : false
          hasPrev   : true,      // show previous button, optional, default: true
          hasNext   : true,      // show next button, optional, default: true
          hasClose  : false
        })
          .pipe(throttleTime(100))  // prevents multiple overlapping events firing for e.g., rewind (which would rewind all the way back)
          .subscribe(event => {
          console.log('(PrayPage) (initMediaControls) (event) -- ', event);
          switch(event) {
            case 'play':
              this.zone.run(() => this.resumeSpeech());
              break;
            case 'pause':
              this.zone.run(() => this.pauseSpeech());
              break;
            case 'seekbackward':
              this.zone.run(() => this.rewind());
              break;
            case 'seekforward':
              this.zone.run(() => this.fastForward());
              break;
            case 'nexttrack':
              this.zone.run(() => this.fastForward());
              break;
            case 'previoustrack':
              this.zone.run(() => this.rewind(true));
              break;
            case 'stop':
              this.zone.run(() => {
                this.speechPlaying = false;
                this.speechPaused = false;
                this.speechService.pause();
              });
              break;
          }
        });
        this.controls.setPlaybackState(true);
      } catch (e) {
        console.warn(e);
        console.warn("It looks like the MediaControls plugin isn't working on your platform. Sorry!");
      }
    }
  }

  valueToText(obj : LiturgyObject) : string {
    let base : string;
    if(obj.value && Array.isArray(obj.value)) {
      if(obj.value[0].hasOwnProperty('text')) {
        base = obj.value[0].text;
      } else {
        base = obj.value[0];
      }
    } else {
      base = obj.value;
    }
    return JSON.stringify(base).replace(/[\[\]\{\}\,\"]/g, '').replace(/\&nbsp\;/g, ' ');;
  }

  async setMediaControls(obj : LiturgyObject) {
    if(this.mediaControlsEnabled) {
      if(obj) {
        let title = obj.localname || obj.label || obj.citation || this.valueToText(obj);
        this.controls.setMetadata({
          artist: 'Venite',
          track: title,
          album: this.obj.name,
          isPlaying: !this.speechPaused
        });
      }
    }
  }

  speak() {
    this.initMediaControls();
    this.speechPlaying = true;
    this.speechService.currentText().subscribe(text => this.audioText = text);
    this.speechService.currentObject()
      .subscribe(object => {
        if(object) {
          this.setMediaControls(object);
          this.scrollTo(object);
        }
      });
    this.speechService.speakLiturgy(this.obj)
      .subscribe(finished => {
        if(finished) {
          this.speechPlaying = false;
          this.speechPaused = false;
          this.speechService.pause();
          this.controls.endSession();
        }
      });
    setTimeout(() => {
      this.speechService.pause();
      setTimeout(() => {
        this.speechService.resume();
      }, 10);
    }, 10);

    this.analytics.trackEvent(`${this.language}-${this.version}-${this.liturgy}`, 'TTSPlay');
  }

  pauseSpeech() {
    this.speechPaused = true;
    this.speechService.pause();
    if(this.mediaControlsEnabled) {
      this.controls.setPlaybackState(false);
    }
  }

  resumeSpeech() {
    this.speechPaused = false;
    this.speechService.resume();
    if(this.mediaControlsEnabled) {
      this.controls.setPlaybackState(true);
    }
  }

  fastForward() {
    this.speechService.fastForward();

    if(this.speechPaused) {
      setTimeout(() => {
        this.speechService.pause();
      }, 1);
    }
  }

  rewind(force : boolean = false) {
    this.speechService.rewind(force);

    if(this.speechPaused) {
      setTimeout(() => {
        this.speechService.pause();
      }, 1);
    }
  }

  // Analytics
  ionViewWillLeave() {
    this.pauseSpeech();

    if(this.timeStarted) {
      let timeLeaving : Date = new Date(),
          timePrayed : number = timeLeaving.getTime() - this.timeStarted.getTime();
      console.log(`prayed for ${timePrayed/1000} seconds`);
    }

    this.listeners.forEach(listener => listener.remove());
  }

  // Sharing
  canShare() : boolean {
    return !!((navigator as any).share);
  }

  clearSelection() {
    this.selectionService.clear();
  }

  undoSelection() {
    this.selectionService.undo();
  }

  redoSelection() {
    this.selectionService.redo();
  }

  async share(selection : SelectedTextEvent) {
    const baseUrl = this.location.path(),
          anchor = `#${selection.fragment}` || '',
          url = `https://venite.app${baseUrl}${anchor}`,
          obj = this.obj,
          date = new Date(obj.date),
          cite = selection.citation ? `- ${selection.citation}` : '',
          hashtag = `#${obj.name.replace(/\s/g, '')}`;

    let shareRet = await Share.share({
      title: `${obj.name} - ${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`,
      text: `“${selection.text}” ${cite} ${hashtag}`,
      url,
      dialogTitle: 'Share your Prayer'
    });
  }

  // Docx download
  convertToDocx(obj : CompiledLiturgy) {
    let date = new Date(obj.date);
    this.planService.postDocx(obj)
      .subscribe(blob => this.planService.download(blob, `${obj.name} - ${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}.docx`));

    this.analytics.trackEvent(`${this.language}-${this.version}-${this.liturgy}`, 'DownloadDocx');
  }

  // Asynchronous Bible readings
  checkForPending(obj : CompiledLiturgy) {
    console.log('(PrayPage) (checkForPending) Updated object received: ', obj);
    this.obj = obj;
    this.hasPending = this.obj.liturgy
      .flat()
      .map(lo => lo.pending || (!lo.value && !lo.verses))
      .reduce((a, b) => a || b);
  }

  // Save current liturgy and settings as a bulletin
  async saveBulletin() {
    const b = await this.bulletin.saveBulletin(this.obj, this.settings);
    const popover = await this.popoverController.create({
      component: CopyBulletinLinkComponent,
      translucent: true,
      backdropDismiss: true,
      componentProps: {
        'link': `https://venite.app/pray/bulletin/${b.id}`
      }
    });
    this.analytics.trackEvent(`${this.language}-${this.version}-${this.liturgy}`, 'SaveBulletin');
    return await popover.present();
  }
}
