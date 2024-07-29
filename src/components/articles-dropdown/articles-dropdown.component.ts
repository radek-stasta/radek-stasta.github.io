import { Component, OnInit } from '@angular/core';
import { FileReaderService } from '../../services/file-reader/file-reader.service';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data/data.service';

export interface IArticle {
  title: string;
  filename: string;
  tags: string[];
}

export interface IArticlePath {
  filename: string;
  path: string;
}

@Component({
  selector: 'app-articles-dropdown',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './articles-dropdown.component.html',
  styleUrl: './articles-dropdown.component.sass',
})
export class ArticlesDropdownComponent implements OnInit {
  protected articles: IArticle[] = [];
  protected tags: string[] = [];
  protected articlesLoaded = false;

  private _articleFiles = ['publishing-angular-app-to-github-pages'];

  constructor(
    private _fileReader: FileReaderService,
    protected _router: Router,
    private _dataService: DataService,
  ) {}

  async ngOnInit() {
    const tagPrefix = '#+TAGS:';
    const articlePaths = this.getArticlePaths();

    for (const path of articlePaths) {
      const text = (await this._fileReader.readFile(path.path)).text;
      const lines = text.split('\n');

      if (lines.length > 0) {
        let firstLine = lines[0];
        let tagsArray: string[] = [];

        if (firstLine.startsWith('#+title:')) {
          firstLine = firstLine.slice(8).trim(); // Remove '#+title' and trim whitespace
        }

        for (const line of lines) {
          // loop to find the tagline
          if (line.startsWith(tagPrefix)) {
            tagsArray = line.slice(tagPrefix.length).trim().split(' '); // split tags into array
            break;
          }
        }

        this.articles.push({
          title: firstLine,
          filename: path.filename,
          tags: tagsArray,
        });

        // get array of all unique tags in articles
        this.tags = Array.from(new Set([...this.tags, ...tagsArray]));
      }
    }
    this.articlesLoaded = true;
  }

  getArticlePaths() {
    const articlePaths: IArticlePath[] = [];
    this._articleFiles.forEach((file) => {
      articlePaths.push({
        filename: file,
        path: `/articles/${file}/${file}.${this._dataService.selectedLanguage}`,
      });
    });
    return articlePaths;
  }

  async navigateToArticle(article: IArticle) {
    this._dataService.isArticleDropdownVisible = false;
    await this._router.navigateByUrl('articles?pathname=' + article.filename);
  }
}
