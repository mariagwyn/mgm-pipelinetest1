import { Injectable } from '@angular/core';

import { CapacitorBrowser } from 'ionic-appauth/lib/capacitor';

@Injectable({
    providedIn: 'root'
})
export class BrowserService extends CapacitorBrowser {
}
