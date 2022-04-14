import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePacksComponent } from './create-packs.component';

describe('CreatePacksComponent', () => {
  let component: CreatePacksComponent;
  let fixture: ComponentFixture<CreatePacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
