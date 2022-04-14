import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPointVenteComponent } from './gestion-point-vente.component';

describe('GestionPointVenteComponent', () => {
  let component: GestionPointVenteComponent;
  let fixture: ComponentFixture<GestionPointVenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPointVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPointVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
