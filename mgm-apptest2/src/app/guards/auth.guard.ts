import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { StorageService } from '../auth/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private storage : StorageService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('(AuthGuard) (canActivate) entering')
    const authenticated = await this.auth.isAuthenticated();
    console.log('(AuthGuard) (canActivate) authenticated = ', authenticated);
    if (authenticated) {
      this.storage.removeItem('redirectUri');
      console.log('(AuthGuard) passed AuthGuard!');
      return true;
    }

    // Save URL we were trying to get
    this.storage.setItem('redirectUri', state.url);

    // Redirect to login flow.
    console.log('(AuthGuard) blocked by AuthGuard!');
    this.auth.signIn();
    return false;
  }
}
