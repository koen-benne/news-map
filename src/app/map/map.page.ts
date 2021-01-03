import {HttpClient} from '@angular/common/http';
import { transition } from '../animations/news';
import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as feed from '../../assets/news-feed.json';
import * as turf from '@turf/turf';
import {StorageService} from '../storage.service';
import {MapboxOutput, MapboxSearchService} from '../mapbox-search.service';
import {SharedService} from '../shared.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
})

export class MapPage implements OnInit {
  // Get popup element
  @ViewChild('popup', {read: ElementRef}) popup: ElementRef<HTMLElement>;

  // Subscribe to map update event
  mapUpdateEventSubscription: Subscription;

  // Custom animation for transition
  animation = transition;

  map: mapboxgl.Map;
  style = 'mapbox://styles/yerboycone/ckiq3d2hr4kxt17m3491dsory';

  // Current position
  currentPosition = {lng: 5.5, lat: 52};

  radiusInKm = 15;

  geojson = feed.news;

  filters = [
    new Filter(0, 'cool', 'american-football-outline'),
    new Filter(1, 'sick', 'business-outline'),
    new Filter(2, 'epic', 'earth-outline'),
    new Filter(3, 'sick', 'business-outline'),
    new Filter(4, 'cool', 'american-football-outline'),
    new Filter(5, 'epic', 'earth-outline'),
    new Filter(6, 'sick', 'business-outline'),
    new Filter(7, 'epic', 'earth-outline'),
    new Filter(8, 'cool', 'american-football-outline'),
    new Filter(9, 'epic', 'earth-outline'),
    new Filter(10, 'cool', 'american-football-outline'),
    new Filter(11, 'sick', 'business-outline'),
  ];

  categories = [
    new FilterCategory(0, 'Sport', [
      this.filters[0],
      this.filters[1],
      this.filters[2],
    ]),
    new FilterCategory(1, 'Cultuur', [
      this.filters[3],
      this.filters[4],
      this.filters[5],
    ]),
    new FilterCategory(2, '112', [
      this.filters[6],
      this.filters[7],
      this.filters[8],
    ]),
    new FilterCategory(3, 'Politiek', [
      this.filters[9],
      this.filters[10],
      this.filters[11],
    ]),
  ];

  selectedCategory = this.categories[0];
  currentFeature = this.geojson.features[0];

  constructor(private http: HttpClient, private renderer: Renderer2, private storageService: StorageService,
              private mapboxSearchService: MapboxSearchService, private sharedService: SharedService)
  {
    this.mapUpdateEventSubscription = this.sharedService.getUpdateMap().subscribe(() => {
      this.loadMarkers();
      this.showRadius();
    });
  }

  async ngOnInit() {
    // For some reason the map takes the correct size when its put in the event loop like this...
    setTimeout(() => this.buildMap(), 0);

    const address = await this.storageService.get('location');
    this.setCoordinates(address);
  }

  // Sets currentPosition to the proper coordinates
  setCoordinates(searchTerm) {
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxSearchService
          .search(searchTerm)
          .subscribe((output: MapboxOutput) => {
            const geometries = output.features.map(feat => feat.geometry);
            if (geometries && geometries.length > 0) {
              const coordinates = geometries[0].coordinates;
              this.currentPosition = {lng: coordinates[0], lat: coordinates[1]};
            }
          });
    }
  }

  private async buildMap() {
    const radiusFromStorage = await this.storageService.get('radius');
    this.radiusInKm = parseInt(radiusFromStorage || '15', 10);

    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [this.currentPosition.lng, this.currentPosition.lat],
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

  // Create radius layer
  async showRadius() {

    if (this.map.getSource('source_radius')) {
      this.map.removeLayer('radius');
      this.map.removeSource('source_radius');
    }

    await this.map.addSource('source_radius', {
      type: 'geojson',
      data: {
          type: 'FeatureCollection',
          features: [{
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: [this.currentPosition.lng, this.currentPosition.lat],
              }
          }]
      }
    });

    // calculate the radius from meters to pixels
    const KmToPixelsAtMaxZoom = (km, lat) => (km * 1000) / 0.019 / Math.cos(lat * Math.PI / 180);

    // add layer for circle
    this.map.addLayer({
      id: 'radius',
      type: 'circle',
      source: 'source_radius',
      layout: {},
      paint: {
          'circle-radius': {
            base: 2,
            stops: [
              [0, 0],
              [22, KmToPixelsAtMaxZoom(this.radiusInKm, this.currentPosition.lat)]
            ]
            },
          'circle-color': '#7ab4ff',
          'circle-opacity': 0.5
      },
    });
  }

  // Loads markers
  public loadMarkers() {
    // Filter geojson
    const filteredFeatures = [];
    // For each feature
    for (const article of this.geojson.features) {
      // Check if article is within radius
      if (turf.distance([this.currentPosition.lng, this.currentPosition.lat],
          article.geometry.coordinates, {units: 'kilometers'}) <= this.radiusInKm) {
        // For each category
        for (const category of article.properties.categories) {
          // Check if category is enabled, if one is enabled show article
          if (this.filters.find(obj => obj.id === category).isChecked) {
            filteredFeatures.push(article);
            break;
          }
        }
      }
    }

    // Add markers
    filteredFeatures.forEach((addMarker) => {
      // Create a DIV for each feature
      const el = document.createElement('div');
      el.id = 'marker';
      el.className = 'marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.backgroundImage = ('url(../../assets/icon/categories/' + addMarker.properties.categories[0] + '.svg)');
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'Pointer';

      // Add event that opens popup on click
      el.addEventListener('click', () => {
        if (this.currentFeature === addMarker && this.popup.nativeElement.style.display === 'block') {
          this.renderer.setStyle(this.popup.nativeElement, 'display', 'none');
        }
        else {
          this.currentFeature = addMarker;

          // Opens popup
          this.renderer.setStyle(this.popup.nativeElement, 'display', 'block');
        }
      });

      // Hide popup on map movement
      this.map.on('move', () => {
        this.renderer.setStyle(this.popup.nativeElement, 'display', 'none');

      });

      // Add marker for each feature and add to map
      new mapboxgl.Marker(el)
          .setLngLat(addMarker.geometry.coordinates)
          .addTo(this.map);
    });
  }

  // Toggle filter
  private toggleFilter(filter) {
    filter.isChecked = !filter.isChecked;

    // Remove and reload markers
    const paras = document.getElementsByClassName('marker');
    while (paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }

    this.loadMarkers();
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
  isChecked: boolean;

  constructor(id: number, name: string, iconUrl: string, isChecked = true) {
    this.id = id;
    this.name = name;
    this.iconUrl = iconUrl;
    this.isChecked = isChecked;
  }
}
