import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FileReaderService } from '../../services/file-reader/file-reader.service';
import { OrgToHtmlConverterService } from '../../services/org-to-html-converter/org-to-html-converter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-article-viewer',
  standalone: true,
  imports: [],
  templateUrl: './article-viewer.component.html',
  styleUrl: './article-viewer.component.sass',
})
export class ArticleViewerComponent implements OnInit, OnDestroy {
  @Input() headerElement!: ElementRef;

  private _scrollSubscription: Subscription = new Subscription();

  protected articleHtml: SafeHtml = '';
  protected summaryLines: string[] = [];

  constructor(
    private _fileReaderService: FileReaderService,
    private _orgToHtmlConverterService: OrgToHtmlConverterService,
    private _sanitizer: DomSanitizer,
    private _viewportScroller: ViewportScroller,
    private _dataService: DataService,
  ) {}

  async ngOnInit() {
    const articleResult = await this._fileReaderService.readFile(
      'articles/github-pages-guide/github-pages-guide.cz',
    );
    this.articleHtml = this._sanitizer.bypassSecurityTrustHtml(
      this._orgToHtmlConverterService.convert(articleResult.text, [
        {
          placeholder: 'lastModified',
          substitution: articleResult.lastModified,
        },
      ]),
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(
      this.articleHtml.toString(),
      'text/html',
    );
    const headings = doc.querySelectorAll('h1, h2'); // selects all h1 and h2
    this.summaryLines = Array.from(headings).map((h) => {
      const id = h.id;
      const text = h.textContent ?? '';
      const indentation = h.tagName.toLowerCase() === 'h2' ? 'pl-8' : '';
      return `<div class="${indentation}"><a href="#${id}">${text}</a></div>`;
    });
  }

  @HostListener('document:click', ['$event'])
  public handleLinks(event: Event): void {
    const target = event.target as HTMLElement;

    // If the target is a link and its href attribute starts with '#'
    if (
      target.tagName === 'A' &&
      target.getAttribute('href')?.startsWith('#')
    ) {
      event.preventDefault(); // Prevent the default action

      // Extract the id from the href attribute and scroll to the target
      const id = target.getAttribute('href')!.slice(1);
      this._viewportScroller.scrollToAnchor(id);

      // scroll adjustment due to sticky header
      const scrollAdjustment = this._dataService.headerHeight;
      const scrollRect = this._viewportScroller.getScrollPosition();
      setTimeout(() => {
        this._viewportScroller.scrollToPosition([
          scrollRect[0],
          scrollRect[1] - scrollAdjustment,
        ]);
      });
    }
  }

  ngOnDestroy(): void {
    this._scrollSubscription.unsubscribe();
  }
}
