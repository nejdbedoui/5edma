import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEmployesComponent } from './gestion-employes.component';

describe('GestionEmployesComponent', () => {
  let component: GestionEmployesComponent;
  let fixture: ComponentFixture<GestionEmployesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionEmployesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEmployesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
