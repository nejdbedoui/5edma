import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCadeauComponent } from './update-cadeau.component';

describe('UpdateCadeauComponent', () => {
  let component: UpdateCadeauComponent;
  let fixture: ComponentFixture<UpdateCadeauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCadeauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCadeauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
