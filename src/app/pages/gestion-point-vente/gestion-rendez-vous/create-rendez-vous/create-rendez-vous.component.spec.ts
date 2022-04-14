import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRendezVousComponent } from './create-rendez-vous.component';

describe('CreateRendezVousComponent', () => {
  let component: CreateRendezVousComponent;
  let fixture: ComponentFixture<CreateRendezVousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRendezVousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
