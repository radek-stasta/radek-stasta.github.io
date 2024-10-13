import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article/article.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.sass',
})
export class ArticlesComponent implements OnInit {
  articleContent = '';

  constructor(private _articleService: ArticleService) {}

  ngOnInit(): void {
    this._articleService.getArticle('test_article.txt').subscribe((content: string) => {
      this.articleContent = content;
    });
  }
}
