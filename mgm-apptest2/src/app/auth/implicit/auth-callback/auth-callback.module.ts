import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoadingModule } from '../../../shared/loading/loading.module';
import { SharedModule } from '../../../shared/shared.module';

import { IonicModule } from '@ionic/angular';

import { AuthCallbackPage } from './auth-callback.page';

const routes: Routes = [
  {
    path: '',
    component: AuthCallbackPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LoadingModule,
    SharedModule
  ],
  declarations: [AuthCallbackPage]
})
export class AuthCallbackPageModule {}
