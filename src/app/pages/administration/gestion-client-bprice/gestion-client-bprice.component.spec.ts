import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionClientBpriceComponent } from './gestion-client-bprice.component';

describe('GestionClientBpriceComponent', () => {
  let component: GestionClientBpriceComponent;
  let fixture: ComponentFixture<GestionClientBpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionClientBpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionClientBpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
