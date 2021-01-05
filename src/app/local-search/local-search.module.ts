import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalSearchPageRoutingModule } from './local-search-routing.module';

import { LocalSearchPage } from './local-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalSearchPageRoutingModule
  ],
  declarations: [LocalSearchPage]
})
export class LocalSearchPageModule {}
