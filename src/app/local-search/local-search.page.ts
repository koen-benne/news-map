import { Component, OnInit } from '@angular/core';
import {transition} from '../animations/news';
import {Feature, MapboxOutput, MapboxSearchService} from '../mapbox-search.service';
import {StorageService} from '../storage.service';
import {NavController} from '@ionic/angular';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-local-search',
  templateUrl: './local-search.page.html',
  styleUrls: ['./local-search.page.scss'],
})
export class LocalSearchPage implements OnInit {
  animation = transition;

  addresses: string[] = [];
  selectedAddress = null;

  constructor(private mapboxSearch: MapboxSearchService,
              private storageService: StorageService,
              private navCtrl: NavController,
              private sharedService: SharedService) { }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxSearch
          .search(searchTerm)
          .subscribe((output: MapboxOutput) => {
            this.addresses = output.features.map(feat => feat.place_name);
          });
    } else {
      this.addresses = [];
    }
  }

  onSelect(address: string) {
    console.log('test');
    this.selectedAddress = address;
    this.addresses = [];

    // Set location in storage
    this.storageService.set('location', this.selectedAddress);

    this.navCtrl.navigateBack('tabs/account');

    this.sharedService.sendUpdateMap();
    this.sharedService.sendUpdateLocation();
  }

  async ngOnInit() {
    this.selectedAddress = await this.storageService.get('location');
  }

}
