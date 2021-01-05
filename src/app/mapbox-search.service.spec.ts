import { TestBed } from '@angular/core/testing';

import { MapboxSearchService } from './mapbox-search.service';

describe('MapboxSearchService', () => {
  let service: MapboxSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
