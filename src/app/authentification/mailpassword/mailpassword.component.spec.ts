import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailpasswordComponent } from './mailpassword.component';

describe('MailpasswordComponent', () => {
  let component: MailpasswordComponent;
  let fixture: ComponentFixture<MailpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
