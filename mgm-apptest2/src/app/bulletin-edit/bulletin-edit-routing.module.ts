import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulletinEditPage } from './bulletin-edit.page';

const routes: Routes = [
  { path: ':uid/edit', component: BulletinEditPage },
  { path: ':y/:m/:d', component: BulletinEditPage },
  { path: ':y/:m/:d/:liturgy', component: BulletinEditPage },
  { path: ':language/:version/:y/:m/:d/:liturgy', component: BulletinEditPage },
  { path: ':language/:version/:y/:m/:d/:liturgy/:prefs', component: BulletinEditPage },
  { path: ':language/:version/:y/:m/:d/:liturgy/:prefs/:vigil', component: BulletinEditPage },
  { path: '', component: BulletinEditPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulletinEditPageRoutingModule {}
