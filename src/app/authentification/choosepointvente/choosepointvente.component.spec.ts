import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosepointventeComponent } from './choosepointvente.component';

describe('ChoosepointventeComponent', () => {
  let component: ChoosepointventeComponent;
  let fixture: ComponentFixture<ChoosepointventeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosepointventeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosepointventeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
