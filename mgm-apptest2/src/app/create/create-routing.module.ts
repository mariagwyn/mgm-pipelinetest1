import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePage } from './create.page';
import { PermissionGuard } from '../guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: CreatePage,
    canActivate: [PermissionGuard],
    children: [
      {
        path: 'liturgy',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./create-liturgy/create-liturgy.module').then(m => m.CreateLiturgyPageModule)
          }
        ]
      },
      {
        path: 'prayer',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./create-prayer/create-prayer.module').then(m => m.CreatePrayerPageModule)
          }
        ]
      },
      {
        path: 'psalm',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./create-psalm/create-psalm.module').then(m => m.CreatePsalmPageModule)
          }
        ]
      },
      {
        path: 'collect',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./create-collect/create-collect.module').then(m => m.CreateCollectPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/create/liturgy',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatePageRoutingModule {}
