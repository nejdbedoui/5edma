import { TestBed } from '@angular/core/testing';

import { MvtStockEndPointService } from './mvt-stock-end-point.service';

describe('MvtStockEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MvtStockEndPointService = TestBed.get(MvtStockEndPointService);
    expect(service).toBeTruthy();
  });
});
