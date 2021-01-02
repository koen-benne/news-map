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

  constructor(public storageService: StorageService, private sharedService: SharedService) { }

  updateRange() {
    if (this.radius) {
      console.log('test');
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
  }

}
