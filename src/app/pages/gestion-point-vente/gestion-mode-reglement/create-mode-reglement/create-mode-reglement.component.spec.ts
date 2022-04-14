import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModeReglementComponent } from './create-mode-reglement.component';

describe('CreateModeReglementComponent', () => {
  let component: CreateModeReglementComponent;
  let fixture: ComponentFixture<CreateModeReglementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModeReglementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModeReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
