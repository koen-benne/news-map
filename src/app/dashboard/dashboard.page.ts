import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {AuthenticateService} from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userEmail: string;
  userName: string;

  constructor(
      private navCtrl: NavController,
      private authService: AuthenticateService
  ) { }

  ngOnInit() {

    this.authService.userDetails().subscribe(res => {
      if (res) {
        this.userEmail = res.email;
        this.userName = res.displayName;
      } else {
        this.navCtrl.navigateForward('register');
      }
    }, err => {
      console.log('err', err);
    });

  }

  logout() {
    this.authService.logoutUser()
        .then(res => {
          this.navCtrl.navigateBack('');
        })
        .catch(error => {
          console.log(error);
        });
  }
}
