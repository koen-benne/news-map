import { Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';

import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  lat = 52;
  lng = 5.5;
  constructor() { }

  ngOnInit() {
    setTimeout(() => this.buildMap(), 0);
  }

  private buildMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
      bounds: [[3, 50.2], [7.6, 53.8]],
    });

    this.map.setMaxBounds(this.map.getBounds());
  }

}

