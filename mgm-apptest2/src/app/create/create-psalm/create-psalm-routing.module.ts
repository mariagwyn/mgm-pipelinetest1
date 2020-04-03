import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePsalmPage } from './create-psalm.page';
import { EditPsalmWrapperComponent } from '../../shared/edit-psalm-wrapper/edit-psalm-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: CreatePsalmPage
  },
  {
    path: 'new',
    component: EditPsalmWrapperComponent
  },
  {
    path: 'edit/:id',
    component: EditPsalmWrapperComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePsalmPageRoutingModule {}
