import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { PrayPage } from '../pray/pray.page';

import { Location } from '@angular/common';
import { PopoverController, ModalController, ActionSheetController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { CompiledLiturgy, UserPreferences, LiturgyObject } from '../models/liturgy.model';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DisplaySettings } from '../models/display-settings.model';
import { Favorite } from '../models/favorite.model';
import { SettingsComponent } from '../shared/settings/settings.component';
import { CopyBulletinLinkComponent } from '../shared/copy-bulletin-link/copy-bulletin-link.component';
import { BulletinTutorialComponent } from './bulletin-tutorial/bulletin-tutorial.component';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { PlanService } from '../services/plan.service';
import { SpeechService } from '../services/speech.service';
import { PreferencesService } from '../services/preferences.service';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../auth/auth.service';
import { SelectionService } from '../services/selection.service';
import { BulletinService } from '../services/bulletin.service';
import { SelectedTextEvent } from '../models/selection.model';

import { MediaControlsService } from '../services/mediacontrols.service';
import { DarkmodeService } from '../services/darkmode.service';
import { AnalyticsService } from '../services/analytics.service';

import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

@Component({
  selector: 'venite-bulletin-edit',
  templateUrl: './bulletin-edit.page.html',
  styleUrls: ['./bulletin-edit.page.scss']
})
export class BulletinEditPage extends PrayPage {
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
    public actionsheet : ActionSheetController,
    public modal : ModalController
  ) {
    super(
      recipeService, route, location, title, planService,
      speechService, favoriteService, popoverController, analytics,
      preferencesService, authService, selectionService, zone, toast,
      controls, darkmode, bulletin, router, actionsheet
    );
  }

  async ngOnInit() {
    super.initControls();
    super.initLiturgyFromParams(false, true);
    super.initDisplaySettings();
  }

  ionViewWillLeave() {
    if(this.listeners) {
      this.listeners.forEach(listener => listener.remove());
    }
  }

  ionViewWillEnter() {
  }

  async watchTutorial() {
    this.analytics.trackEvent('bulletin_tutorial', 'watch');
    const modal = await this.modal.create({
      component: BulletinTutorialComponent
    });
    return await modal.present();
  }

  saveDraft() {
    this.bulletin.saveDraft(this.bulletinDraftId, this.obj, this.settings)
      .then(async data => {
        const toast = await this.toast.create({
          message: 'Your draft bulletin has been autosaved.',
          duration: 2000
        });
        toast.present();
      })
      .catch(async e => {
        console.warn(e);
        const toast = await this.toast.create({
          message: 'Warning: We were unable to save your bulletin as a local draft. Make sure to click the "link" button in the top-right corner to have a copy of this bulletin.',
          duration: 2000,
          color: 'warning'
        });
        toast.present();
      });
  }

  checkForPending(event) {
    super.checkForPending(event);
    this.saveDraft();
  }

}
