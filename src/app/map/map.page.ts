import {HttpClient} from '@angular/common/http';
import { transition } from '../animations/news';
import { Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
})

export class MapPage implements OnInit {
  animation = transition;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  lat = 52;
  lng = 5.5;

  filters = [
      new Filter(0, 'cool', 'american-football-outline'),
      new Filter(1, 'sick', 'business-outline'),
      new Filter(2, 'epic', 'earth-outline'),
  ];

  categories = [
      new FilterCategory(0, 'Sport', [this.filters[0], this.filters[1], this.filters[2]]),
      new FilterCategory(1, 'Cultuur', [this.filters[1], this.filters[0], this.filters[2]]),
      new FilterCategory(2, '112', [this.filters[0], this.filters[2], this.filters[1]]),
      new FilterCategory(3, 'Politiek', [this.filters[2], this.filters[0], this.filters[1]]),
  ];
  selectedCategory = this.categories[0];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // For some reason the map takes the correct size when its put in the event loop like this...
    setTimeout(() => this.buildMap(), 0);
  }

  private buildMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.lng, this.lat],
      bounds: [[3, 50.2], [7.6, 53.8]],
    });
    // disable map rotation
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    // Set max scroll of map to fit the Netherlands
    this.map.setMaxBounds(this.map.getBounds());
    this.map.setZoom(6.5);
  }

  private selectCategory(id: number) {
    if (this.selectedCategory.id !== id) {
      for (const category of this.categories) {
        if (category.id === id) {
          this.selectedCategory = category;
          return;
        }
      }
    }
  }
}

class FilterCategory {
  id: number;
  name: string;
  filters: Filter[];

  constructor(id: number, name: string, filters: Filter[]) {
    this.id = id;
    this.name = name;
    this.filters = filters;
  }
}

class Filter {
  id: number;
  name: string;
  iconUrl: string;

  constructor(id: number, name: string, iconUrl: string) {
    this.id = id;
    this.name = name;
    this.iconUrl = iconUrl;
  }
}
