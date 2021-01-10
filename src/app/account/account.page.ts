import {Component, OnInit} from '@angular/core';
import {transition} from '../animations/news';
import {StorageService} from '../storage.service';
import {SharedService} from '../shared.service';
import {NavController} from '@ionic/angular';
import {AuthenticateService} from '../authentication.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  // Subscribe to location update event
  locationUpdateEventSubscription: Subscription;

  animation = transition;

  location = '';

  radius: number;
  radiusIsOn: boolean;

  userEmail: string;
  userName: string;

  loggedInIsHidden = true;
  notLoggedInIsHidden = true;

  constructor(public storageService: StorageService, private sharedService: SharedService,
              public navCtrl: NavController, private authService: AuthenticateService)
  {
    this.locationUpdateEventSubscription = this.sharedService.getUpdateMap().subscribe(async () => {
      this.location = await this.storageService.get('location');
    });
  }

  async updateRangeToggle() {
    await this.storageService.set('radiusIsOn', this.radiusIsOn.toString());

    this.sharedService.sendUpdateMap();
  }

  updateRange() {
    if (this.radius) {
      this.storageService.set('radius', this.radius.toString());
    }

    this.sharedService.sendUpdateMap();
  }

  async ngOnInit() {
    this.authService.userDetails().subscribe(res => {
      if (res) {
        this.userEmail = res.email;
        this.userName = res.displayName;
        this.loggedInIsHidden = false;
        this.notLoggedInIsHidden = true;
      } else {
        this.notLoggedInIsHidden = false;
      }
    }, err => {
      console.log('err', err);
    });

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
      console.log(radiusIsOn);
      this.radiusIsOn = (radiusIsOn === 'true');
    } else {
      this.radiusIsOn = true;
      this.storageService.set('radiusIsOn', 'true');
    }
  }

  logout() {
    this.authService.logoutUser()
        .then(res => {
          this.loggedInIsHidden = true;
          this.notLoggedInIsHidden = false;
          this.navCtrl.navigateForward('/');
        })
        .catch(error => {
          console.log(error);
        });
  }

}
