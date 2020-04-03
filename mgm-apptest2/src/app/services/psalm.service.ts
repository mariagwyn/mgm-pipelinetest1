import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

import { Observable } from 'rxjs';

import { CrudService } from './crud.service';
import { Pagination } from './pagination.interface';
import { Psalm } from '../models/psalm.model';
import { bcv_parser } from 'bible-passage-reference-parser/js/en_bcv_parser';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PsalmService extends CrudService<Psalm, number> {
  bcv = new bcv_parser;

  constructor(protected http: HttpClient, protected auth : AuthService) {
    super(http, environment.apiUrl, 'psalm', auth);
  }

  paginateByLanguageVersion(page: number, language : string, version : string) : Observable<Pagination<Psalm>> {
    return this.paginateQuery({language, version}, 10, page);
  }

  getCanticles(language : string, version : string[]) : Observable<Psalm[]> {
    return this.http.get<Psalm[]>(`${this._base}/${this._resource}/canticles`,
      { params: {language, version: JSON.stringify(version) } });
  }

  getVersions() : Observable<string[]> {
    return this.http.get<string[]>(`${this._base}/${this._resource}/versions`);
  }

  getPsalmNumbers(version : string) : Observable<string[]> {
    return this.http.get<string[]>(`${this._base}/${this._resource}/numbers`,
      { params: { version } }
    );
  }

  getPsalm(number : string, version : string) : Observable<Psalm[]> {
    return this.http.get<Psalm[]>(`${this._base}/${this._resource}/get`,
      { params: { number, version } }
    );
  }

  versesInCitation(citation : string) : string[] {
    return this.bcv.parse(citation)    // "Psalm 116:1-4, 12"
      .osis()                             // 'Ps.116.1-Ps.116.4,Ps.116.12'
      .split(',')                         // [ 'Ps.116.1-Ps.116.4', 'Ps.116.12' ]
      .map(range => range.split('-'))     // [ [ 'Ps.116.1', 'Ps.116.4' ], [ 'Ps.116.12' ] ]
      .map(range => {
        if(range.length == 1) {
          return range.split('.')[2].replace(/[a-z]/g, '');
        } else {
          const start = range[0].split('.')[2].replace(/[a-z]/g, ''),
                end = range[range.length-1].split('.')[2].replace(/[a-z]/g, ''),
                list = [];
          for (let i = parseInt(start); i <= parseInt(end); i++) {
            list.push(i);
          }
          return list.map(i => i.toString());
        }
      })
      .flat();
  }
}
