import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateremiseComponent } from './updateremise.component';

describe('UpdateremiseComponent', () => {
  let component: UpdateremiseComponent;
  let fixture: ComponentFixture<UpdateremiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateremiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateremiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
