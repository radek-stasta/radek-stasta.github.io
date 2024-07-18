import { Component, OnInit } from '@angular/core';
import { FileReaderService } from '../../services/file-reader/file-reader.service';
import { OrgToHtmlConverterService } from '../../services/org-to-html-converter/org-to-html-converter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-article-viewer',
  standalone: true,
  imports: [],
  templateUrl: './article-viewer.component.html',
  styleUrl: './article-viewer.component.sass',
})
export class ArticleViewerComponent implements OnInit {
  protected articleHtml: SafeHtml = '';
  protected summaryLines: string[] = [];

  constructor(
    private _fileReaderService: FileReaderService,
    private _orgToHtmlConverterService: OrgToHtmlConverterService,
    private _sanitizer: DomSanitizer,
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
      const text = h.textContent || '';
      return `<a href="#${id}">${text}</a>`;
    });
  }
}
