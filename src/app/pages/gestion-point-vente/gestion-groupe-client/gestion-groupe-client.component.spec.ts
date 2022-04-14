import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGroupeClientComponent } from './gestion-groupe-client.component';

describe('GestionGroupeClientComponent', () => {
  let component: GestionGroupeClientComponent;
  let fixture: ComponentFixture<GestionGroupeClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionGroupeClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionGroupeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
