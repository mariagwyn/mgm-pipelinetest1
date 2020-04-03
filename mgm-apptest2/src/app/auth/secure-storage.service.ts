import { Injectable } from '@angular/core';

import { CapacitorStorage } from 'ionic-appauth/lib/capacitor';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService extends CapacitorStorage{
}
