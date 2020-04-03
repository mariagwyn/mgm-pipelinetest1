import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AngularFireAnalytics } from '@angular/fire/analytics';

import { Analytics } from 'capacitor-analytics';
const analytics = new Analytics();

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  analytics = new Analytics();

  constructor(
    private platform : Platform,
    private af : AngularFireAnalytics
  ) { }

  startTracker(ua : string) : Promise<void> {
    if(this.platform.is('capacitor')) {
      return this.analytics.enable();
    } else {
      return Promise.resolve();
    }
  }

  trackEvent(category : string, action : string, label : string = undefined, value : number = undefined) {
    if(this.platform.is('capacitor')) {
      this.analytics.logEvent({name: action, params: { category, label, value }});
    } else {
      this.af.logEvent(
        action,
        { category, label, value }
      );
    }
  }
}
