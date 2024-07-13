import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticleViewerComponent } from '../components/article-viewer/article-viewer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ArticleViewerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  @ViewChild('stickyHeader', { static: false }) headerElement!: ElementRef;
  public isHeaderSticky = false;

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
    } else {
      this.isHeaderSticky = false;
    }

    if (window.scrollY == 0) {
      this.headerElement.nativeElement.classList.remove('sticky');
    }
  }
}
