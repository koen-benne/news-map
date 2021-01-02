import { Component, OnInit } from '@angular/core';
import {transition} from '../animations/news';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  animation = transition;

  location = '';

  constructor(public storageService: StorageService) { }

  async ngOnInit() {
    this.location = await this.storageService.get('location');
    if (!this.location) {
      this.storageService.set('location', 'Utrecht');
      this.location = await this.storageService.get('location');
    }
  }

}
