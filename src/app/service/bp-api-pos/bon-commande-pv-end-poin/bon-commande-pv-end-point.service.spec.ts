import { TestBed } from '@angular/core/testing';

import { BonCommandePvEndPointService } from './bon-commande-pv-end-point.service';

describe('BonCommandePvEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BonCommandePvEndPointService = TestBed.get(BonCommandePvEndPointService);
    expect(service).toBeTruthy();
  });
});
