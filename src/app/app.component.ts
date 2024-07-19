import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleViewerComponent } from '../components/article-viewer/article-viewer.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data/data.service';
import { MenuDropdownComponent } from '../components/menu-dropdown/menu-dropdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ArticleViewerComponent,
    CommonModule,
    MenuDropdownComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('stickyHeader', { static: false }) headerElement!: ElementRef;
  public isHeaderSticky = false;

  constructor(private _dataService: DataService) {}

  ngAfterViewInit() {
    this._dataService.headerHeight =
      this.headerElement.nativeElement.scrollHeight;
  }

  get headerClasses() {
    return {
      'duration-500 translate-y-full': this.isHeaderSticky, // Apply when header is sticky
      'duration-0 default-top': !this.isHeaderSticky, // Apply when header is sticky
    };
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    if (window.scrollY >= this.headerElement.nativeElement.scrollHeight) {
      this.isHeaderSticky = true;
      this.headerElement.nativeElement.classList.add('sticky');
      this.headerElement.nativeElement.classList.add('border-b-2');
      this.headerElement.nativeElement.classList.add('border-black');
    } else {
      this.isHeaderSticky = false;
    }

    if (window.scrollY == 0) {
      this.headerElement.nativeElement.classList.remove('sticky');
      this.headerElement.nativeElement.classList.remove('border-b-2');
      this.headerElement.nativeElement.classList.remove('border-black');
    }
  }
}
