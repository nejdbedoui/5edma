import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateActionCommercialeComponent } from './update-action-commerciale.component';

describe('UpdateActionCommercialeComponent', () => {
  let component: UpdateActionCommercialeComponent;
  let fixture: ComponentFixture<UpdateActionCommercialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateActionCommercialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateActionCommercialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
