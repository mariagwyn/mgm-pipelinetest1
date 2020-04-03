import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinutesSecondsPipe } from '../pipes/minutesseconds.pipe';

import { MeditatePageRoutingModule } from './meditate-routing.module';

import { MeditatePage } from './meditate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeditatePageRoutingModule
  ],
  declarations: [MeditatePage, MinutesSecondsPipe],
})
export class MeditatePageModule {}
