import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ArticleViewerComponent } from '../components/article-viewer/article-viewer.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data/data.service';
import { MenuDropdownComponent } from '../components/menu-dropdown/menu-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ArticleViewerComponent,
    CommonModule,
    MenuDropdownComponent,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('header', { static: false }) headerElement!: ElementRef;
  protected isArticleDropdownVisible = false;

  constructor(
    protected _dataService: DataService,
    protected _router: Router,
  ) {}

  ngAfterViewInit() {
    this._dataService.headerHeight =
      this.headerElement.nativeElement.scrollHeight;
  }

  setArticlesDropdownVisibility(value: boolean) {
    this.isArticleDropdownVisible = value;
  }
}
