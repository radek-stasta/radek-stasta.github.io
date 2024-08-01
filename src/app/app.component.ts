import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ArticleViewerComponent } from '../components/article-viewer/article-viewer.component';
import {
  CommonModule,
  isPlatformBrowser,
  NgOptimizedImage,
} from '@angular/common';
import { DataService } from '../services/data/data.service';
import { ArticlesDropdownComponent } from '../components/articles-dropdown/articles-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ArticleViewerComponent,
    CommonModule,
    ArticlesDropdownComponent,
    TranslateModule,
    NgOptimizedImage,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('header', { static: false }) headerElement!: ElementRef;
  @ViewChild('mainDiv', { static: false }) mainDivElement!: ElementRef;
  protected isScrolledTop = true;

  constructor(
    protected dataService: DataService,
    protected router: Router,
    private _cookieService: CookieService,
    @Inject(PLATFORM_ID) private _platform: string,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this._platform)) {
      // set language from cookie or browser if not in cookie
      let language = this._cookieService.get('language');

      if (!language) {
        language = navigator.language;
        console.log(language);
        if (
          language.toLowerCase().includes('cz') ||
          language.toLowerCase().includes('cs')
        ) {
          language = 'cz';
        } else {
          language = 'en';
        }

        this._cookieService.set('language', language, 365);
      }

      this.dataService.selectedLanguage = language;
    }
  }

  ngAfterViewInit() {
    this.dataService.headerHeight =
      this.headerElement.nativeElement.scrollHeight;
  }

  onMainDivScroll(event: Event) {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    this.isScrolledTop = scrollTop === 0;
  }

  scrollToTop() {
    this.mainDivElement.nativeElement.scrollTop = 0;
  }

  setArticlesDropdownVisibility(value: boolean) {
    this.dataService.isArticleDropdownVisible = value;
  }
}
