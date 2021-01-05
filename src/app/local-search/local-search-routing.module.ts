import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalSearchPage } from './local-search.page';

const routes: Routes = [
  {
    path: '',
    component: LocalSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalSearchPageRoutingModule {}
