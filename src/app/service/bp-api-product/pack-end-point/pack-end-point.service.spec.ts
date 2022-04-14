import { TestBed } from '@angular/core/testing';

import { PackEndPointService } from './pack-end-point.service';

describe('PackEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PackEndPointService = TestBed.get(PackEndPointService);
    expect(service).toBeTruthy();
  });
});
