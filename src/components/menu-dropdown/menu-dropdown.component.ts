import { Component, OnInit } from '@angular/core';
import { FileReaderService } from '../../services/file-reader/file-reader.service';

export interface IArticle {
  title: string;
  filename: string;
}

export interface IArticlePath {
  filename: string;
  path: string;
}

@Component({
  selector: 'app-menu-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './menu-dropdown.component.html',
  styleUrl: './menu-dropdown.component.sass',
})
export class MenuDropdownComponent implements OnInit {
  protected articles: IArticle[] = [];

  private _articleFiles = ['github-pages-guide'];

  constructor(private _fileReader: FileReaderService) {}

  async ngOnInit() {
    const articlePaths = this.getArticlePaths();
    for (const path of articlePaths) {
      const text = (await this._fileReader.readFile(path.path)).text;
      const lines = text.split('\n');

      if (lines.length > 0) {
        let firstLine = lines[0];

        if (firstLine.startsWith('#+title:')) {
          firstLine = firstLine.slice(8).trim(); // Remove '#+title' and trim whitespace
        }

        this.articles.push({
          title: firstLine,
          filename: path.filename,
        });
      }
    }
  }

  getArticlePaths() {
    const articlePaths: IArticlePath[] = [];
    this._articleFiles.forEach((file) => {
      articlePaths.push({
        filename: file,
        path: `/articles/${file}/${file}.cz`,
      });
    });
    return articlePaths;
  }
}
