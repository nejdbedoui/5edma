import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitfilterComponent } from './produitfilter.component';

describe('ProduitfilterComponent', () => {
  let component: ProduitfilterComponent;
  let fixture: ComponentFixture<ProduitfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduitfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduitfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
