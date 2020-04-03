import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'implicit/callback', loadChildren: './auth/implicit/auth-callback/auth-callback.module#AuthCallbackPageModule' },
  { path: 'implicit/logout', loadChildren: './auth/implicit/end-session/end-session.module#EndSessionPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  {
    path: '',
    loadChildren: () => import('./pray-menu/pray-menu.module').then( m => m.PrayMenuPageModule)
  },
  {
    path: 'pray',
    loadChildren: () => import('./pray/pray.module').then( m => m.PrayPageModule)
  },
  //{
  //  path: 'translate',
  //  loadChildren: () => import('./translate/translate.module').then( m => m.TranslatePageModule)
  //},
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'meditate',
    loadChildren: () => import('./meditate/meditate.module').then( m => m.MeditatePageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'reminders',
    loadChildren: () => import('./reminders/reminders.module').then( m => m.RemindersPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'psalter',
    loadChildren: () => import('./psalter/psalter.module').then( m => m.PsalterPageModule)
  },
  {
    path: 'bulletins',
    loadChildren: () => import('./bulletins/bulletins.module').then( m => m.BulletinsPageModule)
  },
  {
    path: 'bulletin',
    loadChildren: () => import('./bulletin-edit/bulletin-edit.module').then( m => m.BulletinEditPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
