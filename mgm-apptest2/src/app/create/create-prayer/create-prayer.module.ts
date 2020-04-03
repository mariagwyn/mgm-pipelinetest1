import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';

import { CreatePrayerPageRoutingModule } from './create-prayer-routing.module';

import { CreatePrayerPage } from './create-prayer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePrayerPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatePrayerPage]
})
export class CreatePrayerPageModule {}
