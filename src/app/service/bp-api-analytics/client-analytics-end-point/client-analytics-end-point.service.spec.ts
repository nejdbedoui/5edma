import { TestBed } from '@angular/core/testing';

import { ClientAnalyticsEndPointService } from './client-analytics-end-point.service';

describe('ClientAnalyticsEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientAnalyticsEndPointService = TestBed.get(ClientAnalyticsEndPointService);
    expect(service).toBeTruthy();
  });
});
