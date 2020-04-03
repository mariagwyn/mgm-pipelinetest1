import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  async set(key: string, data: any): Promise<void> {
    return Storage.set({key, value: JSON.stringify(data)});
  }

  async get(key: string) : Promise<any> {
    return JSON.parse((await Storage.get({ key })).value);
  }

  async remove(key : string) : Promise<void> {
    return Storage.remove({ key })
  }

  async clear() : Promise<void> {
    return Storage.clear();
  }
}
