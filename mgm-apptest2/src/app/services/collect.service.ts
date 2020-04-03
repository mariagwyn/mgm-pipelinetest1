import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CrudService } from './crud.service';
import { AuthService } from '../auth/auth.service';
import { Pagination } from './pagination.interface';
import { Collect } from '../models/collect.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectService extends CrudService<Collect, number> {

  constructor(protected http: HttpClient, protected auth: AuthService) {
    super(http, environment.apiUrl, 'collect', auth);
  }

}
