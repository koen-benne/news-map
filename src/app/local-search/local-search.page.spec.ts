import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocalSearchPage } from './local-search.page';

describe('LocalSearchPage', () => {
  let component: LocalSearchPage;
  let fixture: ComponentFixture<LocalSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocalSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
