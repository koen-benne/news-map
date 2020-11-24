import { Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';

import * as mapboxgl from 'mapbox-gl';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  lat = 52;
  lng = 5.5;
  constructor() { }

  ngOnInit() {
    // For some reason the map takes the correct size when its put in the event loop like this...
    setTimeout(() => this.buildMap(), 0);
    setTimeout(() => this.loadMarkers(), 0);
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

  private loadMarkers() {
    // Load data to geojson
    let geojson = {
      type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [4.895167899999933, 52.3702157]
          },
          properties: {
            title: 'Mapbox',
            description: 'test'
          }
        }]
    };

    // Add markers
    geojson.features.forEach((addMarker) => {
      // Create a DIV for each feature
      let el = document.createElement('div');
      el.className = 'marker';

      console.log(addMarker.geometry.coordinates);
      // Add marker for each feature and add to map
      new mapboxgl.Marker(el)
        .setLngLat(addMarker.geometry.coordinates)
        .addTo(this.map);
    });
  }

}

