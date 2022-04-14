import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriePossitionComponent } from './categorie-possition.component';

describe('CategoriePossitionComponent', () => {
  let component: CategoriePossitionComponent;
  let fixture: ComponentFixture<CategoriePossitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriePossitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriePossitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
