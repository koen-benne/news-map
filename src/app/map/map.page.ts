import {HttpClient} from '@angular/common/http';
import { transition } from '../animations/news';
import { Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import * as feed from '../../assets/news-feed.json';

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

  radiusCenter = [5.5, 52];
  radiusInKm = 5;

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

    // Add radius and markers
    this.map.on('load', () => {
      this.showRadius();
      this.loadMarkers();
    });
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

  private showRadius() {
    this.map.addSource("source_radius", {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": this.radiusCenter,
              }
          }]
      }
    });

    // calculate the radius from meters to pixels
    const KmToPixelsAtMaxZoom = (km, lat) => (km * 1000) / 0.019 / Math.cos(lat * Math.PI / 180);
  
    // add layer for circle
    this.map.addLayer({
      "id": "radius",
      "type": "circle",
      "source": "source_radius",
      "layout": {},
      "paint": {
          "circle-radius": {
            'base': 2,
            'stops': [
              [0, 0],
              [22, KmToPixelsAtMaxZoom(this.radiusInKm, this.lat)]
            ]
            },
          "circle-color": "#7DB5FA",
          "circle-opacity": 0.3
      },
    });
  }

  private loadMarkers() {
    // Load data to geojson
    let geojson = feed.news;

    // Add markers
    geojson.features.forEach((addMarker) => {
      // Create a DIV for each feature
      let el = document.createElement('div');
      el.id = 'marker';
      el.className = 'marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.backgroundImage = ('url(../../assets/icon/categories/'+ addMarker.properties.categories[0] +'.svg)');
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'Pointer';

      // Add event that opens popup on click
      el.addEventListener('click', () => {
        let content = '<ion-card-header><ion-card-title>' + addMarker.properties.title + '</ion-card-title></ion-card-header>' +
            '<ion-card-content><ion-nav-link><a href=\"' + addMarker.properties.link + '\">Lees meer...</a></ion-nav-link></ion-card-content>';

        let info = document.getElementById('info');
        info.innerHTML = content;

        // Opens popup
        let popup = document.getElementById('popup');
        popup.style.display = 'block';
      });

      // Hide popup on map movement
      this.map.on('move', () => {
        let popup = document.getElementById('popup');
        popup.style.display = 'none';
      })

      // Add marker for each feature and add to map
      new mapboxgl.Marker(el)
          .setLngLat(addMarker.geometry.coordinates)
          .addTo(this.map);
    });
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
