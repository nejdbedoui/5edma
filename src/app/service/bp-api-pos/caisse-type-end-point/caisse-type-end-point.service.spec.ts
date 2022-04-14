import { TestBed } from '@angular/core/testing';

import { CaisseTypeEndPointService } from './caisse-type-end-point.service';

describe('CaisseTypeEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaisseTypeEndPointService = TestBed.get(CaisseTypeEndPointService);
    expect(service).toBeTruthy();
  });
});
