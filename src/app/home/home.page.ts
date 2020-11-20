import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { transition } from '../animations/news';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  animation = transition;

  constructor(private http: HttpClient) {}
}
