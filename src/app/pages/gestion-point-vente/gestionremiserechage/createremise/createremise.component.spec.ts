import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateremiseComponent } from './createremise.component';

describe('CreateremiseComponent', () => {
  let component: CreateremiseComponent;
  let fixture: ComponentFixture<CreateremiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateremiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateremiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
