import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PrayPageRoutingModule } from './pray-routing.module';

import { PrayPage } from './pray.page';


import { LoadingModule } from '../shared/loading/loading.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayPageRoutingModule,
    FontAwesomeModule,
    LoadingModule,
    SharedModule
  ],
  declarations: [
    PrayPage
  ]
})
export class PrayPageModule {}
