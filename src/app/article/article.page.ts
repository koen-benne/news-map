import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { transition } from '../animations/news';
import * as feed from '../../assets/news-feed.json';
import { ActivatedRoute } from '@angular/router';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { endWith } from 'rxjs/operators';

@Component({
  selector: 'app-article',
  templateUrl: 'article.page.html',
  styleUrls: ['article.page.scss'],
})
export class ArticlePage implements OnInit {
  animation = transition;

  articles = [];
  queryParams;

  geojson = feed.news;

  constructor(private route: ActivatedRoute) {
    
  }

  filterTrending() {
    // For each feature
    for (const article of this.geojson.features) {
      if (article.properties.trending) {
        if (article.properties.id == this.queryParams.id) {
          this.articles.push(article);
        }
      }
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.queryParams = params;
      }
    });

    this.filterTrending();
  }
}