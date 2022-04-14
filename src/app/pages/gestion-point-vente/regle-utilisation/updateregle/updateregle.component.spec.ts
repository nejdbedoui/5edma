import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateregleComponent } from './updateregle.component';

describe('UpdateregleComponent', () => {
  let component: UpdateregleComponent;
  let fixture: ComponentFixture<UpdateregleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateregleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateregleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
