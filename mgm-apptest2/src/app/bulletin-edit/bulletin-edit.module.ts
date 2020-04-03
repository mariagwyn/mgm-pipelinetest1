import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingModule } from '../shared/loading/loading.module';
import { SharedModule } from '../shared/shared.module';

import { BulletinEditPageRoutingModule } from './bulletin-edit-routing.module';

import { BulletinEditPage } from './bulletin-edit.page';
import { BulletinTutorialComponent } from './bulletin-tutorial/bulletin-tutorial.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BulletinEditPageRoutingModule,
    FontAwesomeModule,
    LoadingModule,
    SharedModule
  ],
  declarations: [BulletinEditPage, BulletinTutorialComponent]
})
export class BulletinEditPageModule {}
