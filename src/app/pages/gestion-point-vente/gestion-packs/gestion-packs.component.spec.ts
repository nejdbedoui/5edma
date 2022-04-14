import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPacksComponent } from './gestion-packs.component';

describe('GestionPacksComponent', () => {
  let component: GestionPacksComponent;
  let fixture: ComponentFixture<GestionPacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
