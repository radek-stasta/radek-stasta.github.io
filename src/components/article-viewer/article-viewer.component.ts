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
    const articleResult = await this._fileReaderService.readFile(
      'articles/github-pages-guide/github-pages-guide.cz',
    );
    this.articleHtml = this._orgToHtmlConverterService.convert(
      articleResult.text,
      [
        {
          placeholder: 'lastModified',
          substitution: articleResult.lastModified,
        },
      ],
    );
  }
}
