import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecategorieComponent } from './createcategorie.component';

describe('CreatecategorieComponent', () => {
  let component: CreatecategorieComponent;
  let fixture: ComponentFixture<CreatecategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
