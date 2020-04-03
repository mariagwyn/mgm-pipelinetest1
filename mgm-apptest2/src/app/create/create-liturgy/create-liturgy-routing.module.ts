import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateLiturgyPage } from './create-liturgy.page';
import { EditLiturgyWrapperComponent } from '../../shared/edit-liturgy-wrapper/edit-liturgy-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: CreateLiturgyPage
  },
  {
    path: 'new',
    component: EditLiturgyWrapperComponent
  },
  {
    path: 'edit/:id',
    component: EditLiturgyWrapperComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateLiturgyPageRoutingModule {}
