import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CompiledLiturgy, Liturgy, ClientPreferences, LiturgicalDay } from '../models/liturgy.model';
import { Prayer } from '../models/prayer.model';
import { Reading } from '../models/reading.model';

import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getData(
    y : string,
    m : string,
    d : string,
    liturgy : string,
    preferences : ClientPreferences,
    language : string = 'en',
    version : string = 'Rite II',
    rotate : boolean,
    isVigil : boolean = false
  ) : Observable<CompiledLiturgy> {
    console.log('(getData) rotate = ', rotate);
    return this.http.get<CompiledLiturgy>(`${API_URL}/pray`, {
      params: {
        y, m, d,
        liturgy,
        preferences: JSON.stringify(preferences),
        language,
        version,
        rotate: JSON.stringify(rotate),
        vigil: JSON.stringify(isVigil)
      }
    });
  }

  getMenu(lang : string[] = ['en']) : Observable<Liturgy[]> {
    return this.http.get<Liturgy[]>(`${API_URL}/liturgy/menu`, {
      params: {
        lang: JSON.stringify(lang)
      }
    });
  }

  getLiturgicalDay(y : string, m : string, d : string, date : Date = new Date(), evening : boolean = undefined, vigil : boolean = false) : Observable<LiturgicalDay> {
    return this.http.get<LiturgicalDay>(`${API_URL}/calendar/day`, {
      params: {
        y: y || date.getFullYear().toString(),
        m: m || (date.getMonth()+1).toString(),
        d: d || date.getDate().toString(),
        evening: evening !== undefined ? evening.toString() : (date.getHours() > 5).toString(),
        vigil: vigil.toString()
      }
    });
  }

  getAvailableLectionaryReadings(y : string, m : string, d : string, liturgy : string, language : string, version : string) : Observable<Reading[]> {
    const date = new Date();
    return this.http.get<Reading[]>(`${API_URL}/pray/readings`, {
      params: {
        y: y || date.getFullYear().toString(),
        m: m || (date.getMonth()+1).toString(),
        d: d || date.getDate().toString(),
        liturgy,
        language,
        version
      }
    });
  }

  async getLiturgicalColor(y : string, m : string, d : string, date : Date = new Date()) : Promise<string> {
    let day = await this.getLiturgicalDay(y, m, d, date).toPromise();
    return day.color.hex;
  }

  async getPrayer(
    slug : string,
    language : string = 'en',
    version : string = 'Rite II'
  ) : Promise<Prayer> {
    return this.http.get<Prayer>(`${API_URL}/pray/prayer`, {
      params: { slug, language, version }
    }).toPromise();
  }
}
