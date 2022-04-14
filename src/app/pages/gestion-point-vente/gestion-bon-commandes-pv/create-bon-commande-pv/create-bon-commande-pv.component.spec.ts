import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBonCommandePvComponent } from './create-bon-commande-pv.component';

describe('CreateBonCommandePvComponent', () => {
  let component: CreateBonCommandePvComponent;
  let fixture: ComponentFixture<CreateBonCommandePvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBonCommandePvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBonCommandePvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
