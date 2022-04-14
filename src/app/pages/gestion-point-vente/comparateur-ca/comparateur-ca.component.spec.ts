import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparateurCaComponent } from './comparateur-ca.component';

describe('ComparateurCaComponent', () => {
  let component: ComparateurCaComponent;
  let fixture: ComponentFixture<ComparateurCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparateurCaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparateurCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
