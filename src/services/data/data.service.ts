import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _headerHeight = 0;
  private _selectedLanguage = 'en';

  constructor() {
    // nothing to do
  }

  set headerHeight(value: number) {
    this._headerHeight = value;
  }

  get headerHeight() {
    return this._headerHeight;
  }

  set selectedLanguage(language) {
    this._selectedLanguage = language;
  }

  get selectedLanguage() {
    return this._selectedLanguage;
  }
}
