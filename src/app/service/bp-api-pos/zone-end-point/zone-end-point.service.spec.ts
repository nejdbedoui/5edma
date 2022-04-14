import { TestBed } from '@angular/core/testing';

import { ZoneEndPointService } from './zone-end-point.service';

describe('ZoneEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZoneEndPointService = TestBed.get(ZoneEndPointService);
    expect(service).toBeTruthy();
  });
});
