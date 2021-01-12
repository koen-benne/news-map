import {Component, OnInit} from '@angular/core';
import { transition } from '../animations/news';
import * as feed from '../../assets/news-feed.json';

@Component({
  selector: 'app-news',
  templateUrl: 'news.page.html',
  styleUrls: ['news.page.scss'],
})
export class NewsPage implements OnInit {
  animation = transition;

  articles = [];

  geojson = feed.news;

  constructor() {

  }

  filterTrending() {
    // For each feature
    for (const article of this.geojson.features) {
      if (article.properties.trending) {
        this.articles.push(article);
      }
    }
  }

  ngOnInit() {
    this.filterTrending();
  }
}
