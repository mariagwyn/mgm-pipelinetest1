import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PsalterPageRoutingModule } from './psalter-routing.module';

import { PsalterPage } from './psalter.page';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PsalterPageRoutingModule,
    SharedModule
  ],
  declarations: [PsalterPage]
})
export class PsalterPageModule {}
