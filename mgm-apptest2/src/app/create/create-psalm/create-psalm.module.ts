import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { CreatePsalmPageRoutingModule } from './create-psalm-routing.module';

import { CreatePsalmPage } from './create-psalm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePsalmPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatePsalmPage]
})
export class CreatePsalmPageModule {}
