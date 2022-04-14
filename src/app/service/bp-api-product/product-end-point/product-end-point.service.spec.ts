import { TestBed } from '@angular/core/testing';

import { ProductEndPointService } from './product-end-point.service';

describe('ProductEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductEndPointService = TestBed.get(ProductEndPointService);
    expect(service).toBeTruthy();
  });
});
