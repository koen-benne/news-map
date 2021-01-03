import {Component, OnInit} from '@angular/core';
import {transition} from '../animations/news';
import {StorageService} from '../storage.service';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  animation = transition;

  location = '';

  radius: number;
  radiusIsOn: boolean;

  constructor(public storageService: StorageService, private sharedService: SharedService) { }

  updateRangeToggle() {
    if (this.radiusIsOn) {
      this.storageService.set('radiusIsOn', this.radiusIsOn.toString());
    }
  }

  updateRange() {
    if (this.radius) {
      this.storageService.set('radius', this.radius.toString());
    }

    this.sharedService.sendUpdateMap();
  }

  async ngOnInit() {
    this.location = await this.storageService.get('location');
    if (!this.location) {
      this.storageService.set('location', 'Utrecht');
      this.location = await this.storageService.get('location');
    }

    const radius = await this.storageService.get('radius');
    if (radius) {
      this.radius = parseInt(radius, 10);
    } else {
      this.radius = 15;
      this.storageService.set('radius', '15');
    }

    const radiusIsOn = await this.storageService.get('radiusIsOn');
    if (radiusIsOn) {
      this.radiusIsOn = (radiusIsOn === 'true');
    } else {
      this.radiusIsOn = true;
      this.storageService.set('radiusIsOn', 'true');
    }

  }

}
