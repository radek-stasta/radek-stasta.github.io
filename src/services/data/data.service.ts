import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _headerHeight = 0;
  private _selectedLanguage = new BehaviorSubject<string>('en');

  constructor(
    private _translateService: TranslateService,
    private _cookieService: CookieService,
  ) {
    // nothing to do
  }

  set headerHeight(value: number) {
    this._headerHeight = value;
  }

  get headerHeight() {
    return this._headerHeight;
  }

  set selectedLanguage(language: string) {
    this._cookieService.set('language', language, 365);
    this._translateService.use(language);
    this._selectedLanguage.next(language);
  }

  get selectedLanguage() {
    return this._selectedLanguage.getValue();
  }

  getSelectedLanguageSubject() {
    return this._selectedLanguage;
  }
}
