import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBonCommandesPvComponent } from './gestion-bon-commandes-pv.component';

describe('GestionBonCommandesPvComponent', () => {
  let component: GestionBonCommandesPvComponent;
  let fixture: ComponentFixture<GestionBonCommandesPvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionBonCommandesPvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionBonCommandesPvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
