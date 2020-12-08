import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsPage } from './news.page';
import {MapPage} from '../map/map.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: NewsPage,
      },
      {
        path: 'article',
        loadChildren: () => import('../article/article.module').then(m => m.ArticlePageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsPageRoutingModule {}
