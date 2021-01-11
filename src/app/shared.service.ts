import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private map = new Subject<any>();
  private location = new Subject<any>();

  sendUpdateMap() {
    this.map.next();
  }

  sendUpdateLocation() {
    this.location.next();
  }

  getUpdateMap(): Observable<any>{
    return this.map.asObservable();
  }

  getUpdateLocation(): Observable<any> {
    return this.location.asObservable();
  }
}
