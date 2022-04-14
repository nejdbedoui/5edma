import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMouvementComponent } from './gestion-mouvement.component';

describe('GestionMouvementComponent', () => {
  let component: GestionMouvementComponent;
  let fixture: ComponentFixture<GestionMouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionMouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
