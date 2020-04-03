import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePrayerPage } from './create-prayer.page';
import { EditPrayerWrapperComponent } from '../../shared/edit-prayer-wrapper/edit-prayer-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: CreatePrayerPage
  },
  {
    path: 'new',
    component: EditPrayerWrapperComponent
  },
  {
    path: 'edit/:id',
    component: EditPrayerWrapperComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePrayerPageRoutingModule {}
