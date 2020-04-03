import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';

import { PrayMenuPageRoutingModule } from './pray-menu-routing.module';

import { PrayMenuPage } from './pray-menu.page';

import { KeysPipe } from '../pipes/keys.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayMenuPageRoutingModule,
    SharedModule
  ],
  declarations: [
    KeysPipe,
    PrayMenuPage
  ]
})
export class PrayMenuPageModule {}
