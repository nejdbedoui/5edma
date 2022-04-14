import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProduitsArticlesComponent } from './gestion-produits-articles.component';

describe('GestionProduitsArticlesComponent', () => {
  let component: GestionProduitsArticlesComponent;
  let fixture: ComponentFixture<GestionProduitsArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionProduitsArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionProduitsArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
