import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActionCommercialeComponent } from './create-action-commerciale.component';

describe('CreateActionCommercialeComponent', () => {
  let component: CreateActionCommercialeComponent;
  let fixture: ComponentFixture<CreateActionCommercialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateActionCommercialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActionCommercialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
