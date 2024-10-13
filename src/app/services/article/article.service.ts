import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private readonly _http: HttpClient) {}

  getArticle(fileName: string): Observable<string> {
    return this._http
      .get(`articles/${fileName}`, { responseType: 'text' })
      .pipe(map((data: string) => this._parseArticle(data)));
  }

  private _parseArticle(data: string): string {
    const lines = data.split('\n');
    let html = '';

    lines.forEach((line) => {
      if (line.startsWith('#+TITLE:')) {
        html += `<h1>${line.replace('#+TITLE:', '').trim()}</h1>`;
      } else if (line.startsWith('#+AUTHOR:')) {
        html += `<p><strong>Author:</strong> ${line.replace('#+AUTHOR:', '').trim()}</p>`;
      } else if (line.startsWith('#+DATE:')) {
        html += `<p><strong>Date:</strong> ${line.replace('#+DATE:', '').trim()}</p>`;
      } else if (line.startsWith('* ')) {
        html += `<h2>${line.replace('* ', '').trim()}</h2>`;
      } else if (line.startsWith('** ')) {
        html += `<h3>${line.replace('** ', '').trim()}</h3>`;
      } else if (line.startsWith('- ')) {
        html += `<li>${line.replace('- ', '').trim()}</li>`;
      } else {
        html += `<p>${line.trim()}</p>`;
      }
    });

    // Wrap list items in <ul> tags
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

    return html;
  }
}
