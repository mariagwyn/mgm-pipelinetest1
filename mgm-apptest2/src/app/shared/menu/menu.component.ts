import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { StorageService } from '../../auth/storage.service';
import { AuthService } from '../../auth/auth.service';
import { AuthenticatedComponent } from '../authenticated/authenticated.component';

//import { faLanguage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'venite-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent extends AuthenticatedComponent {
  //faLanguage = faLanguage;

  hasContentAdminAccess : boolean = false;
  remindersEnabled : boolean = false;

  constructor(
    public auth : AuthService,
    public storage : StorageService,
    public location : Location,
    public platform : Platform
  ) {
    super(auth, storage, location);
  }

  signOut() {
    this.auth.signOut();
  }

  async ngOnInit() {
    super.ngOnInit();

    this.auth.authenticationState.subscribe(async loggedIn => {
      if(loggedIn) {
        this.hasContentAdminAccess = await this.auth.hasContentAdminAccess();
      }
    });

    this.remindersEnabled = this.platform.is('capacitor');
  }

}
