import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoadingModule } from '../../../shared/loading/loading.module';

import { IonicModule } from '@ionic/angular';

import { EndSessionPage } from './end-session.page';

const routes: Routes = [
  {
    path: '',
    component: EndSessionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LoadingModule
  ],
  declarations: [EndSessionPage]
})
export class EndSessionPageModule {}
