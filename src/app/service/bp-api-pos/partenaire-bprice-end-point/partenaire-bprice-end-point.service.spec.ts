import { TestBed } from '@angular/core/testing';

import { PartenaireBpriceEndPointService } from './partenaire-bprice-end-point.service';

describe('PartenaireBpriceEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartenaireBpriceEndPointService = TestBed.get(PartenaireBpriceEndPointService);
    expect(service).toBeTruthy();
  });
});
