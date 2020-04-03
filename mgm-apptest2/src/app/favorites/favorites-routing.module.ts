import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoritesPage } from './favorites.page';
import { AuthGuard } from '../guards/auth.guard';
import { FavoriteDetailComponent } from './favorite-detail/favorite-detail.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: FavoritesPage
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    component: FavoriteDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesPageRoutingModule {}
