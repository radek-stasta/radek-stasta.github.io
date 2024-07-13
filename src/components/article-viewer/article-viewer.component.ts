import { Component, OnInit } from '@angular/core';
import { FileReaderService } from '../../services/file-reader/file-reader.service';
import { OrgToHtmlConverterService } from '../../services/org-to-html-converter/org-to-html-converter.service';

@Component({
  selector: 'app-article-viewer',
  standalone: true,
  imports: [],
  templateUrl: './article-viewer.component.html',
  styleUrl: './article-viewer.component.sass',
})
export class ArticleViewerComponent implements OnInit {
  protected articleHtml = '';

  constructor(
    private _fileReaderService: FileReaderService,
    private _orgToHtmlConverterService: OrgToHtmlConverterService,
  ) {}

  async ngOnInit() {
    const articleText =
      await this._fileReaderService.readFile('github-pages.cz');
    this.articleHtml = this._orgToHtmlConverterService.convert(articleText!, [
      { placeholder: 'lastModified', substitution: 'test' },
    ]);
  }
}
