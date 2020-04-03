import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CrudService } from './crud.service';
import { AuthService } from '../auth/auth.service';
import { Pagination } from './pagination.interface';
import { Favorite } from '../models/favorite.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends CrudService<Favorite, number> {

  constructor(protected http: HttpClient, protected auth: AuthService) {
    super(http, environment.apiUrl, 'favorite', auth);
  }
}
