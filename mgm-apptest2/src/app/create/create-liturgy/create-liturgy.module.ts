import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { CreateLiturgyPageRoutingModule } from './create-liturgy-routing.module';

import { CreateLiturgyPage } from './create-liturgy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateLiturgyPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateLiturgyPage]
})
export class CreateLiturgyPageModule {}
