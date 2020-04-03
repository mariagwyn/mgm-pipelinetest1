import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrayMenuPage } from './pray-menu.page';

const routes: Routes = [
  {
    path: '',
    component: PrayMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrayMenuPageRoutingModule {}
