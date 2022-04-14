import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMouvementComponent } from './create-mouvement.component';

describe('CreateMouvementComponent', () => {
  let component: CreateMouvementComponent;
  let fixture: ComponentFixture<CreateMouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
