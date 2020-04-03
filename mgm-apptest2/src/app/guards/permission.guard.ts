import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { StorageService } from '../auth/storage.service';
import { Group } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate  {
  constructor(private auth: AuthService, private router: Router, private storage: StorageService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const authenticated = await this.auth.isAuthenticated();

    // Save URL we were trying to get
    this.storage.setItem('redirectUri', state.url);

    if(authenticated) {
      const groups : Group[] = await this.auth.getGroups(),
            names : string[] = groups.map(group => group.profile.name);
      return names.includes('Content');
    } else {
      // Redirect to login flow.
      this.auth.signIn();
      return false;
    }
  }
}
