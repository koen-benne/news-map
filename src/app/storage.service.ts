import { Injectable } from '@angular/core';
import {Storage} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async get(key: string) {
    const keys = await Storage.keys();
    try {
      const data = await Storage.get({key});
      return data.value;
    } catch (err) {
      return '';
    }
  }

  async set(key: string, value: string) {
    await Storage.set({key, value});
  }
}
