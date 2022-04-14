import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCommandePvComponent } from './create-commande-pv.component';

describe('CreateCommandePvComponent', () => {
  let component: CreateCommandePvComponent;
  let fixture: ComponentFixture<CreateCommandePvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCommandePvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommandePvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
