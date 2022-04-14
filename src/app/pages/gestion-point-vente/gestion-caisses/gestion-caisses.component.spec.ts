import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCaissesComponent } from './gestion-caisses.component';

describe('GestionCaissesComponent', () => {
  let component: GestionCaissesComponent;
  let fixture: ComponentFixture<GestionCaissesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCaissesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCaissesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
