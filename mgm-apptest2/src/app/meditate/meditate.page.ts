import { Component, OnInit, Input, NgZone } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { AudioService } from '../services/audio.service';
import { MediaControlsService } from '../services/mediacontrols.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { throttleTime } from 'rxjs/operators';

import { DisplaySettings } from '../models/display-settings.model';
import { UserPreferences } from '../models/liturgy.model';
import { PreferencesService } from '../services/preferences.service';

import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'venite-meditate',
  templateUrl: './meditate.page.html',
  styleUrls: ['./meditate.page.sass'],
})
export class MeditatePage implements OnInit {
  @Input() seconds : number;
  @Input() delay : number = 1500;
  @Input() color : string;
  secondsRemaining : number;
  paused : boolean = false;
  modal : boolean = false;
  timer;
  meditateMinutes : number = 5;
  pointerDegrees : number = 360;
  offset : number = 2*(Math.PI * 2 * 100);
  length : number = Math.PI * 2 * 100;
  meditationBell : string = 'singing-bowl';
  mediaControlsEnabled : boolean = false;
  listeners : any[] = new Array();

  constructor(
    private recipeService : RecipeService,
    private analytics : AnalyticsService,
    private audio : AudioService,
    private modalController : ModalController,
    private route : ActivatedRoute,
    private router : Router,
    private loading : LoadingController,
    private preferencesService : PreferencesService,
    private controls : MediaControlsService,
    private zone : NgZone,
    private title : Title
  ) { }

  async ngOnInit() {
    this.title.setTitle('Meditate');
    this.mediaControlsEnabled = this.controls.isAvailable();

    const loading = await this.loading.create({
      message: 'Loading...'
    });
    await loading.present();

    if(!this.color) {
      // load color
      let url = this.router.url,
          [blank, pray, lang, version, y, m, d, liturgySlug] = url.split('/');
      this.recipeService.getLiturgicalDay(y, m, d)
        .subscribe(day => this.color = day.color.hex,
                   error => {
                     console.warn(error);
                     this.color = '#3880ff';
                   });
    }

    // load sound
    this.preferencesService.preferences.subscribe(prefs => {
      const display : DisplaySettings = prefs.displaySettings || new DisplaySettings();
      this.meditationBell = display.meditationBell || new DisplaySettings().meditationBell;
      loading.dismiss();
    });

    // start timer
    if(this.seconds) {
      this.setSecondsAndStart(this.seconds);
    }

    let now = new Date();
    this.analytics.trackEvent('Meditation', `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`);
  }

  setSecondsAndStart(seconds : number, delay : number = 1500) {
    this.audio.preload(this.meditationBell, `assets/audio/${this.meditationBell}.mp3`);
    this.seconds = seconds;
    this.delay = delay;
    this.secondsRemaining = seconds;
    console.log(this.meditationBell);
    this.initMediaControls();
    setTimeout(() => {
      this.audio.play(this.meditationBell);
    }, this.delay);
    setTimeout(() => {
      this.startTimer();
      this.updateMediaControls();
      this.controls.setPlaybackState(true);
    }, this.delay + 500);
  }

  pause() {
    this.stopTimer();
    console.log('this.timer = ', this.timer);
    this.audio.pause(this.meditationBell);
    this.paused = true;
    this.controls.setPlaybackState(false);
    console.log(`have prayed so far for ${this.seconds - this.secondsRemaining} seconds`);
  }

  resume() {
    this.startTimer();
    this.paused = false;
    this.controls.setPlaybackState(true);
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.secondsRemaining--;
      this.pointerDegrees = 360 * this.secondsRemaining / this.seconds;
      this.offset = this.length + (this.length * (this.secondsRemaining / this.seconds));
      if(this.secondsRemaining == 0) {
        this.audio.play(this.meditationBell);
      } else {
        this.controls.setPositionState({
          duration: this.seconds,
          position: this.seconds - this.secondsRemaining
        });
        this.updateMediaControls();
      }
    }, 1000);
    console.log('this.timer = ', this.timer);
  }

  stopTimer() {
    if(this.audio.isReady(this.meditationBell)) {
      this.audio.stop(this.meditationBell);
    }
    clearInterval(this.timer);
  }

  rewind() {
    this.pause();
    this.stopTimer();
    this.setSecondsAndStart(this.seconds);
  }

  dismiss() {
    this.stopTimer();
    this.controls.endSession();
    this.audio.release(this.meditationBell);
    this.seconds = undefined;

    if(this.modal) {
      this.modalController.dismiss();
    } else {
      this.router.navigate(['/']);
    }
  }

  async initMediaControls() {
    console.log('Media Controls enabled? ', this.mediaControlsEnabled);
    if(this.mediaControlsEnabled) {
      let now = new Date();

        this.controls.init({
          artist: 'Venite',
          track: 'Meditation',
          album: `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`,
          duration: this.seconds
        })
          .pipe(throttleTime(100))
          .subscribe(event => {
          switch(event) {
            case 'play':
              this.zone.run(() => this.resume());
              break;
            case 'pause':
              this.zone.run(() => this.pause());
              break;
            case 'seekbackward':
              this.zone.run(() => this.rewind());
              break;
            case 'seekforward':
              this.zone.run(() => this.dismiss());
              break;
            case 'nexttrack':
              this.zone.run(() => this.dismiss());
              break;
            case 'previoustrack':
              this.zone.run(() => this.rewind());
              break;
            case 'stop':
              this.zone.run(() => this.dismiss());
              break;
          }
        });

    }
  }

  async updateMediaControls() {
    if(this.mediaControlsEnabled) {
      let now = new Date();
      try {
        let controls = this.controls.setMetadata({
          artist: 'Venite',
          track: 'Meditation',
          album: `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`,
          duration: this.seconds,
          isPlaying: !this.paused
        });
      } catch (e) {
        console.warn(e);
        console.warn("It looks like the MediaControls plugin isn't working on your platform. Sorry!");
      }
    }
  }

  ionViewWillLeave() {
    this.stopTimer();
    this.listeners.forEach(listener => listener.remove());
  }

}
