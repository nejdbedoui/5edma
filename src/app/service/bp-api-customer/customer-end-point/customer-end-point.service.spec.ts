import { TestBed } from '@angular/core/testing';

import { CustomerEndPointService } from './customer-end-point.service';

describe('CustomerEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerEndPointService = TestBed.get(CustomerEndPointService);
    expect(service).toBeTruthy();
  });
});
