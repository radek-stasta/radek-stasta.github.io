import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _headerHeight = 0;

  constructor() {
    // nothing to do
  }

  set headerHeight(value: number) {
    this._headerHeight = value;
  }

  get headerHeight() {
    return this._headerHeight;
  }
}
