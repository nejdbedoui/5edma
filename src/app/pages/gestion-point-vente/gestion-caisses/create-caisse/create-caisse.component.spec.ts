import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCaisseComponent } from './create-caisse.component';

describe('CreateCaisseComponent', () => {
  let component: CreateCaisseComponent;
  let fixture: ComponentFixture<CreateCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
