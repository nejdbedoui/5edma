import { TestBed } from '@angular/core/testing';

import { CadeauEndPointService } from './cadeau-end-point.service';

describe('CadeauEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CadeauEndPointService = TestBed.get(CadeauEndPointService);
    expect(service).toBeTruthy();
  });
});
