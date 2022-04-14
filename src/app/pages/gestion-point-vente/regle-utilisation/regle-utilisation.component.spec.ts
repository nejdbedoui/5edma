import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegleUtilisationComponent } from './regle-utilisation.component';

describe('RegleUtilisationComponent', () => {
  let component: RegleUtilisationComponent;
  let fixture: ComponentFixture<RegleUtilisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegleUtilisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegleUtilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
