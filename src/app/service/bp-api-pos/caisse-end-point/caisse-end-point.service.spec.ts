import { TestBed } from '@angular/core/testing';

import { CaisseEndPointService } from './caisse-end-point.service';

describe('CaisseEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaisseEndPointService = TestBed.get(CaisseEndPointService);
    expect(service).toBeTruthy();
  });
});
