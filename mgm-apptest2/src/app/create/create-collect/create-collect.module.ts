import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { CreateCollectPageRoutingModule } from './create-collect-routing.module';

import { CreateCollectPage } from './create-collect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCollectPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateCollectPage]
})
export class CreateCollectPageModule {}
