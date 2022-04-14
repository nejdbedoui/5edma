import { TestBed } from '@angular/core/testing';

import { RegelementEndPointService } from './regelement-end-point.service';

describe('RegelementEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegelementEndPointService = TestBed.get(RegelementEndPointService);
    expect(service).toBeTruthy();
  });
});
