import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private subject = new Subject<any>();

  sendUpdateMap() {
    this.subject.next();
  }

  getUpdateMap(): Observable<any>{
    return this.subject.asObservable();
  }
}
