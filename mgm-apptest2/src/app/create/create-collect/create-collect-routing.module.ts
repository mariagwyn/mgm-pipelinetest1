import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCollectPage } from './create-collect.page';
import { EditCollectWrapperComponent } from '../../shared/edit-collect-wrapper/edit-collect-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: CreateCollectPage
  },
  {
    path: 'new',
    component: EditCollectWrapperComponent
  },
  {
    path: 'edit/:id',
    component: EditCollectWrapperComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCollectPageRoutingModule {}
