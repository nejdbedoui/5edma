import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBonCommandesComponent } from './gestion-bon-commandes.component';

describe('GestionBonCommandesComponent', () => {
  let component: GestionBonCommandesComponent;
  let fixture: ComponentFixture<GestionBonCommandesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionBonCommandesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionBonCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
