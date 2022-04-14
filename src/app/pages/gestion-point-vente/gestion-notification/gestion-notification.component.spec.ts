import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNotificationComponent } from './gestion-notification.component';

describe('GestionNotificationComponent', () => {
  let component: GestionNotificationComponent;
  let fixture: ComponentFixture<GestionNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
