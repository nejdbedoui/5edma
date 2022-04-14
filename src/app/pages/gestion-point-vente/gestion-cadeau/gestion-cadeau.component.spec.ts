import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCadeauComponent } from './gestion-cadeau.component';

describe('GestionCadeauComponent', () => {
  let component: GestionCadeauComponent;
  let fixture: ComponentFixture<GestionCadeauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCadeauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCadeauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
