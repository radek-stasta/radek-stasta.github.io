import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FileReaderService } from '../../services/file-reader/file-reader.service';
import {
  EHeadingType,
  OrgToHtmlConverterService,
} from '../../services/org-to-html-converter/org-to-html-converter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DOCUMENT, NgClass } from '@angular/common';
import { DataService } from '../../services/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-article-viewer',
  standalone: true,
  imports: [TranslateModule, NgClass],
  templateUrl: './article-viewer.component.html',
  styleUrl: './article-viewer.component.sass',
  animations: [
    trigger('summaryState', [
      state('up', style({ bottom: 'calc(100% - 6rem)' })),
      state('down', style({ top: '4rem' })),
      transition('up => down', [animate('0.25s')]),
      transition('down => up', [animate('0.25s')]),
    ]),
  ],
})
export class ArticleViewerComponent implements AfterViewInit, OnDestroy {
  @Input() headerElement!: ElementRef;
  @ViewChild('summaryPanelToggle', { static: false })
  summaryPanelToggleElement!: ElementRef;

  private _languageChangeSubscription: Subscription = new Subscription();

  protected articleHtml: SafeHtml = '';
  protected summaryLines: string[] = [];
  protected isSummaryCollapsed = true;

  constructor(
    private _fileReaderService: FileReaderService,
    private _orgToHtmlConverterService: OrgToHtmlConverterService,
    private _sanitizer: DomSanitizer,
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _translateService: TranslateService,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  async ngAfterViewInit() {
    this._languageChangeSubscription = this._dataService
      .onLanguageChange()
      .subscribe(async (value) => {
        console.log(value);
        const currentUrl = this._router.url;
        await this._router.navigateByUrl(
          currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + value,
        );
        await this.reloadArticle();
      });

    await this.reloadArticle();
    this.addCommentsScript();
  }

  @HostListener('document:click', ['$event'])
  public handleLinks(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'A' &&
      target.getAttribute('href')?.startsWith('#')
    ) {
      event.preventDefault();
      const id = target.getAttribute('href')!.slice(1);
      // Get the element
      const element = this._document.getElementById(id);
      const scrollableDiv = this._document.getElementById('main-div');

      if (element && scrollableDiv) {
        // Calculate the position to scroll to
        scrollableDiv.scrollTop =
          element.offsetTop -
          this.summaryPanelToggleElement.nativeElement.clientHeight -
          this._dataService.headerHeight;
        this.isSummaryCollapsed = true;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSummaryCollapsed = true;
  }

  async reloadArticle() {
    const routeParams = this._route.snapshot.params;

    // load article html
    const articleResult = await this._fileReaderService.readFile(
      `articles/${routeParams['articleName']}/${routeParams['language']}.txt`,
    );
    this.articleHtml = this._sanitizer.bypassSecurityTrustHtml(
      this._orgToHtmlConverterService.convert(articleResult.text, [
        {
          placeholder: 'lastModified',
          substitution: articleResult.lastModified,
        },
      ]),
    );

    // construct summary lines
    const serviceSummaryLines = this._orgToHtmlConverterService.summaryLines;

    this.summaryLines = serviceSummaryLines.map((line) => {
      const indentation = line.type === EHeadingType.h2 ? 'pl-8' : '';
      return `<div class="${indentation}"><a href="#${line.id}">${line.text}</a></div>`;
    });

    // add comments link
    this.summaryLines.push(
      `<div class=""><a href="#comments">${this._translateService.instant('articles.comments')}</a></div>`,
    );
  }

  addCommentsScript() {
    const script = this._renderer.createElement('script');
    script.defer = true;
    script.async = true;
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('data-repo', 'radek-stasta/radek-stasta.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOMVlNQw');
    script.setAttribute('data-category', 'giscus');
    script.setAttribute('data-category-id', 'DIC_kwDOMVlNQ84ChCZ1');
    script.setAttribute('data-mapping', 'url');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    this._renderer.appendChild(this._el.nativeElement, script);
  }

  toggleSummary() {
    this.isSummaryCollapsed = !this.isSummaryCollapsed;
  }

  ngOnDestroy() {
    this._languageChangeSubscription.unsubscribe();
  }
}
