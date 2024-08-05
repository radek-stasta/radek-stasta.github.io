import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _headerHeight = 0;
  private _selectedLanguage = 'en';
  private _languageChanged = new Subject<string>();
  private _isArticleDropdownVisible = false;

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
    const originalLanguage = this._selectedLanguage;

    this._cookieService.set('language', language, 365);
    this._translateService.use(language);
    this._selectedLanguage = language;

    if (originalLanguage != this._selectedLanguage) {
      this._languageChanged.next(language);
    }
  }

  get selectedLanguage() {
    return this._selectedLanguage;
  }

  set isArticleDropdownVisible(value: boolean) {
    this._isArticleDropdownVisible = value;
  }

  get isArticleDropdownVisible() {
    return this._isArticleDropdownVisible;
  }

  onLanguageChange() {
    return this._languageChanged.asObservable();
  }
}
