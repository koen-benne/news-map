import {HttpClient} from '@angular/common/http';
import { transition } from '../animations/news';
import { Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {Platform} from '@ionic/angular';

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

  categories = [
      new Category(0, 'Sport', ['s1', 's2', 's3']),
      new Category(1, 'Cultuur', ['c1', 'c2', 'c3']),
      new Category(2, '112', ['11', '12', '13']),
      new Category(3, 'Politiek', ['p1', 'p2', 'p3']),
  ];
  selectedCategory = this.categories[0];

  constructor(private http: HttpClient, public platform: Platform) { }

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

export class Category {
  id: number;
  name: string;
  filters: string[];

  constructor(id: number, name: string, filters: string[]) {
    this.id = id;
    this.name = name;
    this.filters = filters;
  }
}
