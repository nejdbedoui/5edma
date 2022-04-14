import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpadeEmployesComponent } from './upade-employes.component';

describe('UpadeEmployesComponent', () => {
  let component: UpadeEmployesComponent;
  let fixture: ComponentFixture<UpadeEmployesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpadeEmployesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpadeEmployesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
