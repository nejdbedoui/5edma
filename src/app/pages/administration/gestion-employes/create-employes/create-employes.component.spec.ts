import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployesComponent } from './create-employes.component';

describe('CreateEmployesComponent', () => {
  let component: CreateEmployesComponent;
  let fixture: ComponentFixture<CreateEmployesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEmployesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
