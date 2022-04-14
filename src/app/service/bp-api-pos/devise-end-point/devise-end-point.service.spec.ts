import { TestBed } from '@angular/core/testing';

import { DeviseEndPointService } from './devise-end-point.service';

describe('DeviseEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviseEndPointService = TestBed.get(DeviseEndPointService);
    expect(service).toBeTruthy();
  });
});
