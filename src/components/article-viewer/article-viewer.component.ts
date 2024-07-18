import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FileReaderService } from '../../services/file-reader/file-reader.service';
import { OrgToHtmlConverterService } from '../../services/org-to-html-converter/org-to-html-converter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-article-viewer',
  standalone: true,
  imports: [],
  templateUrl: './article-viewer.component.html',
  styleUrl: './article-viewer.component.sass',
})
export class ArticleViewerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() headerElement!: ElementRef;

  private _scrollSubscription: Subscription = new Subscription();

  protected articleHtml: SafeHtml = '';
  protected summaryLines: string[] = [];

  constructor(
    private _fileReaderService: FileReaderService,
    private _orgToHtmlConverterService: OrgToHtmlConverterService,
    private _sanitizer: DomSanitizer,
    private _activatedRoute: ActivatedRoute,
    private _viewportScroller: ViewportScroller,
  ) {}

  // When parent header element is properly initialized
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['headerElement'] && changes['headerElement'].currentValue) {
      this.setScrollSubscription();
    }
  }

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
      const text = h.textContent || '';
      const indentation = h.tagName.toLowerCase() === 'h2' ? 'pl-8' : '';
      return `<div class="${indentation}"><a class="hover:text-rose-500" href="#${id}">${text}</a></div>`;
    });
  }

  setScrollSubscription() {
    this._scrollSubscription = this._activatedRoute.fragment
      .pipe(filter((fragment) => !!fragment))
      .subscribe((fragment) => {
        this._viewportScroller.scrollToAnchor(fragment!);
        // set your scroll adjustments
        const scrollAdjustment = this.headerElement.nativeElement.clientHeight;
        const scrollRect = this._viewportScroller.getScrollPosition();
        setTimeout(() => {
          this._viewportScroller.scrollToPosition([
            scrollRect[0],
            scrollRect[1] - scrollAdjustment,
          ]);
        });
      });
  }

  ngOnDestroy(): void {
    this._scrollSubscription.unsubscribe();
  }
}
