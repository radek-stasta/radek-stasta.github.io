import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ArticleViewerComponent } from '../components/article-viewer/article-viewer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articles', component: ArticleViewerComponent },
  {
    path: 'articles/:articleName/:language',
    component: ArticleViewerComponent,
  },
];
