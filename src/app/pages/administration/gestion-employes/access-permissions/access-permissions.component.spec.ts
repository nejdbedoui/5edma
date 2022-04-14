import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPermissionsComponent } from './access-permissions.component';

describe('AccessPermissionsComponent', () => {
  let component: AccessPermissionsComponent;
  let fixture: ComponentFixture<AccessPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
