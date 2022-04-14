import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFamilleComponent } from './gestion-famille.component';

describe('GestionFamilleComponent', () => {
  let component: GestionFamilleComponent;
  let fixture: ComponentFixture<GestionFamilleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionFamilleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionFamilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
