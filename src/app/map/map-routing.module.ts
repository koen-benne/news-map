import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapPage } from './map.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MapPage,
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
  exports: [RouterModule]
})
export class MapPageRoutingModule {}
