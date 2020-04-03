import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

import { Observable } from 'rxjs';

import { CrudService } from './crud.service';
import { LocalStorageService } from './localstorage.service';
import { Pagination } from './pagination.interface';
import { Bulletin } from '../models/bulletin.model';
import { CompiledLiturgy } from '../models/liturgy.model';
import { DisplaySettings } from '../models/display-settings.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BulletinService extends CrudService<Bulletin, number> {

  constructor(
    protected http: HttpClient,
    protected auth : AuthService,
    private storage : LocalStorageService
  ) {
    super(http, environment.apiUrl, 'bulletin', auth);
  }

  readBulletin(id : number) : Observable<Bulletin> {
    return this._http.get<Bulletin>(`${this._base}/${this._resource}/read?id=${id}`);
  }

  async saveBulletin(liturgy : CompiledLiturgy, settings : DisplaySettings) : Promise<Bulletin> {
    let b = new Bulletin();
    b.settings = settings;
    b.liturgy = liturgy;

    let savedBulletin : Bulletin;
    if(this.loggedIn) {
      savedBulletin = await this._http.post<Bulletin>(`${this._base}/${this._resource}/save`, b,
        { headers: { 'Authorization': `bearer ${this.accessToken}`}}).toPromise();
    } else {
      savedBulletin = await this._http.post<Bulletin>(`${this._base}/${this._resource}/save`, b).toPromise();
    }

    const bulletins = (await this.storage.get('bulletins')) || new Array();
    bulletins.push(savedBulletin.id);
    this.storage.set('bulletins', bulletins);
    return savedBulletin;
  }

  async bookmarkBulletin(bulletin : Bulletin) : Promise<number> {
    const bulletins = (await this.storage.get('bulletins')) || new Array();
    if(!bulletins.includes(bulletin.id)) {
      bulletins.push(bulletin.id);
    }
    this.storage.set('bulletins', bulletins);
    return bulletin.id;
  }

  async getLocalBulletins() : Promise<Bulletin[]> {
    const ids : string[] = (await this.storage.get('bulletins'));
    if(ids) {
      return await (this._http.get<Bulletin[]>(`${this._base}/${this._resource}/many`,
        { params: { ids: ids.join(',') } }
      ).toPromise());
    } else {
      return Promise.resolve([]);
    }
  }

  async saveDraft(uid : string, liturgy : CompiledLiturgy, settings : DisplaySettings, createDate : Date = undefined) : Promise<Bulletin> {
    const bulletin = new Bulletin();
    bulletin.uid = uid;
    bulletin.liturgy = liturgy;
    bulletin.settings = settings;
    if(!!createDate) {
      bulletin.date_added = createDate;
    }
    bulletin.date_modified = new Date();
    this.storage.set(`bulletin-${uid}`, bulletin);
    return bulletin;
  }

  async loadDraft(uid : string) : Promise<Bulletin> {
    return this.storage.get(`bulletin-${uid}`);
  }

  async newDraft(liturgy : CompiledLiturgy, settings : DisplaySettings) : Promise<string> {
    const ids : string[] = await this.listDrafts(),
          uid = Math.random().toString(36).substr(2, 9);

    await this.saveDraft(uid, liturgy, settings, new Date());
    ids.push(uid);
    this.setDrafts(ids);
    return uid;
  }

  async listDrafts() : Promise<string[]> {
    const ids : string[] = (await this.storage.get('draft-bulletins'));
    return ids || [];
  }

  async setDrafts(ids : string[]) : Promise<void> {
    return this.storage.set('draft-bulletins', ids);
  }

  async getDrafts() : Promise<Bulletin[]> {
    const ids : string[] = await this.listDrafts();
    return Promise.all(ids.map(id => this.loadDraft(id)));
  }
}
