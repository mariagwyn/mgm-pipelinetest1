import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AuthService } from './auth.service';
import { AuthHttpService } from './auth-http.service';
import { AuthGuardService } from './auth-guard.service';
import { StorageService } from './storage.service';
import { RequestorService } from './requestor.service';
import { LoadingModule } from '../shared/loading/loading.module';
import { SharedModule } from '../shared/shared.module';
import { AppleSigninComponent } from './apple-signin/apple-signin.component';

@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    IonicModule
  ],
  providers: [
    RequestorService,
    StorageService,
    AuthGuardService,
    AuthHttpService,
    AuthService
  ],
  declarations: [
    AppleSigninComponent
  ]
})
export class AuthModule {
}
