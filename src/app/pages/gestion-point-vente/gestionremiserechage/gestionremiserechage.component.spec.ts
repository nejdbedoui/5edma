import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionremiserechageComponent } from './gestionremiserechage.component';

describe('GestionremiserechageComponent', () => {
  let component: GestionremiserechageComponent;
  let fixture: ComponentFixture<GestionremiserechageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionremiserechageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionremiserechageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
