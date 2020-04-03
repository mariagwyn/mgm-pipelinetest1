import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CrudService } from './crud.service';
import { AuthService } from '../auth/auth.service';
import { Pagination } from './pagination.interface';
import { Prayer } from '../models/prayer.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrayerService extends CrudService<Prayer, number> {

  constructor(protected http: HttpClient, protected auth: AuthService) {
    super(http, environment.apiUrl, 'prayer', auth);
  }

  paginateByLanguageVersion(page: number, language : string, version : string) : Observable<Pagination<Prayer>> {
    return this.paginateQuery({language, version}, 10, page);
  }
}
