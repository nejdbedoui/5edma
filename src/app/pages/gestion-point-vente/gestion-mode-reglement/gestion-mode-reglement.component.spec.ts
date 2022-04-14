import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionModeReglementComponent } from './gestion-mode-reglement.component';

describe('GestionModeReglementComponent', () => {
  let component: GestionModeReglementComponent;
  let fixture: ComponentFixture<GestionModeReglementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionModeReglementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionModeReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
