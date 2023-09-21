import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BaseService {
  isLoggedIn = new BehaviorSubject<any>(false);

  constructor() {}

  setisLoggedIn(value: boolean) {
    this.isLoggedIn.next(value);
  }

  getisLoggedIn() {
    return this.isLoggedIn.asObservable();
  }
}
