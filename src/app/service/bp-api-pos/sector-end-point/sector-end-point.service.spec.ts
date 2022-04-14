import { TestBed } from '@angular/core/testing';

import { SectorEndPointService } from './sector-end-point.service';

describe('SectorEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectorEndPointService = TestBed.get(SectorEndPointService);
    expect(service).toBeTruthy();
  });
});
