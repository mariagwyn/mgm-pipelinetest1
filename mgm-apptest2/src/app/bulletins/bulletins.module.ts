import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';

import { BulletinsPageRoutingModule } from './bulletins-routing.module';

import { BulletinsPage } from './bulletins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BulletinsPageRoutingModule,
    SharedModule
  ],
  declarations: [BulletinsPage]
})
export class BulletinsPageModule {}
