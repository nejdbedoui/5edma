import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCommercialeComponent } from './action-commerciale.component';

describe('ActionCommercialeComponent', () => {
  let component: ActionCommercialeComponent;
  let fixture: ComponentFixture<ActionCommercialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionCommercialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCommercialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
