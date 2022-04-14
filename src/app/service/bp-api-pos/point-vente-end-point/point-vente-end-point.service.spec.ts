import { TestBed } from '@angular/core/testing';

import { PointVenteEndPointService } from './point-vente-end-point.service';

describe('PointVenteEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PointVenteEndPointService = TestBed.get(PointVenteEndPointService);
    expect(service).toBeTruthy();
  });
});
