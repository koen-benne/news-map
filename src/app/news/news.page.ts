import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { transition } from '../animations/news';

@Component({
  selector: 'app-news',
  templateUrl: 'news.page.html',
  styleUrls: ['news.page.scss'],
})
export class NewsPage implements OnInit {
  animation = transition;

  url = 'http://newsapi.org/v2/top-headlines?' +
      'country=nl&' +
      'apiKey=0553bcebde6041e985a295155ab6dd92';

  article: Article = new Article();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.url).subscribe( Response => {
      const response = Response as NewsResponse;
      this.article = response.articles[2] as Article;
    });
  }
}

class NewsResponse {
  articles: Article[];
}

class Article {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  title: string;
  url: string;
  urlToImage: string;
  source: string;
}
