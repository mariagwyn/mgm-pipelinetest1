import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pagination } from './pagination.interface';
import { AuthService } from '../auth/auth.service';
import { Profile } from '../models/user.model';

export interface CrudOperations<T, ID> {
  save(t: T): Observable<T>;
  update(id: ID, t: T): Observable<T>;
  findOne(id: ID): Observable<T>;
  findAll(): Observable<T[]>;
  delete(id: ID): Observable<any>;
}

export abstract class CrudService<T, ID> implements CrudOperations<T, ID> {
  accessToken : string;
  loggedIn : boolean = false;
  userInfo : Profile;

  constructor(
    protected _http: HttpClient,
    protected _base: string,
    protected _resource : string,
    protected authService : AuthService
  ) {
    this.authService.authenticationState.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      console.log('(CrudService) loggedIn = ', loggedIn)
      if(loggedIn) {
        this.accessToken = this.authService.getAccessToken();
      }
    });
    this.authService.userInfo.subscribe(info => this.userInfo = info);
  }

  authHeader() : string {
    if(this.accessToken !== '[APPLE]') {
      return this.accessToken;
    } else {
      return `APPLE|${this.userInfo.login}`;
    }
  }

  save(t: T): Observable<T> {
    if(this.loggedIn) {
      return this._http.post<T>(`${this._base}/${this._resource}`, t,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

  update(id: ID, t: T): Observable<T> {
    if(this.loggedIn) {
      return this._http.put<T>(`${this._base}/${this._resource}/${id}`, t,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

  findOne(id: ID): Observable<T> {
    if(this.loggedIn) {
      return this._http.get<T>(`${this._base}/${this._resource}/${id}`,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

  findAll(sortField : string = 'id', sortOrder : string = 'ASC'): Observable<T[]> {
    console.log('(CrudService) loggedIn? ', this.loggedIn);
    if(this.loggedIn) {
      return this._http.get<T[]>(`${this._base}/${this._resource}/?sort=${sortField},${sortOrder}`,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

  paginateQuery(params : CRUDParams, limit : number = 20, page : number = 1): Observable<Pagination<T>> {
    if(this.loggedIn) {
      let getParams : string = Object.keys(params).map(p => `filter=${p}||eq||${params[p]}`).join('&')
      return this._http.get<Pagination<T>>(`${this._base}/${this._resource}/?paginate=true&limit=${limit}&page=${page}&${getParams}`,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

  query(params : CRUDParams) : Observable<T[]> {
    if(this.loggedIn) {
      let getParams : string = Object.keys(params).map(p => `filter=${p}||eq||${params[p]}`).concat('sort=id,ASC').join('&')
      return this._http.get<T[]>(`${this._base}/${this._resource}/?${getParams}`,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

  querySelect(params : CRUDParams, select: string) : Observable<T[]> {
    if(this.loggedIn) {
      let getParams : string = Object.keys(params).map(p => `filter=${p}||eq||${params[p]}`).concat('sort=id,ASC').join('&');
      return this._http.get<T[]>(`${this._base}/${this._resource}/?${getParams}&select=${select}`,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

  delete(id: ID): Observable<T> {
    if(this.loggedIn) {
      return this._http.delete<T>(`${this._base}/${this._resource}/${id}`,
        { headers: { 'Authorization': `bearer ${this.authHeader()}`}});
    }
  }

}

interface CRUDParams {
  [x: string]: string;
}
