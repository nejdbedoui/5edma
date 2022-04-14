import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModeReglementComponent } from './update-mode-reglement.component';

describe('UpdateModeReglementComponent', () => {
  let component: UpdateModeReglementComponent;
  let fixture: ComponentFixture<UpdateModeReglementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateModeReglementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModeReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
