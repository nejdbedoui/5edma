import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateregleComponent } from './createregle.component';

describe('CreateregleComponent', () => {
  let component: CreateregleComponent;
  let fixture: ComponentFixture<CreateregleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateregleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateregleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
