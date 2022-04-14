import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListproduitbytypeComponent } from './listproduitbytype.component';

describe('ListproduitbytypeComponent', () => {
  let component: ListproduitbytypeComponent;
  let fixture: ComponentFixture<ListproduitbytypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListproduitbytypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListproduitbytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
