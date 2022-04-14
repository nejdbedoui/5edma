import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCadeauComponent } from './create-cadeau.component';

describe('CreateCadeauComponent', () => {
  let component: CreateCadeauComponent;
  let fixture: ComponentFixture<CreateCadeauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCadeauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCadeauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
