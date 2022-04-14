import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientBpriceComponent } from './create-client-bprice.component';

describe('CreateClientBpriceComponent', () => {
  let component: CreateClientBpriceComponent;
  let fixture: ComponentFixture<CreateClientBpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClientBpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClientBpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
