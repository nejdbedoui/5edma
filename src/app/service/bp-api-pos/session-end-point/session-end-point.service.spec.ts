import { TestBed } from '@angular/core/testing';

import { SessionEndPointService } from './session-end-point.service';

describe('SessionEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionEndPointService = TestBed.get(SessionEndPointService);
    expect(service).toBeTruthy();
  });
});
