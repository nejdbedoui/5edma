import { TestBed } from '@angular/core/testing';

import { TaxeEndPointService } from './taxe-end-point.service';

describe('TaxeEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxeEndPointService = TestBed.get(TaxeEndPointService);
    expect(service).toBeTruthy();
  });
});
