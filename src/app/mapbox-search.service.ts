import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapboxSearchService {

  constructor(private http: HttpClient) { }

  search(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url + query + '.json?types=address&language=nl&country=nl&access_token=' + environment.mapbox.accessToken);
  }

}



export interface MapboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
}

export interface Feature {
  place_name: string;
  geometry: Geometry;
}

export interface Geometry {
  coordinates: number[];
}
