import { TestBed } from '@angular/core/testing';

import { PartnerAnalyticsEndPointService } from './partner-analytics-end-point.service';

describe('PartnerAnalyticsEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartnerAnalyticsEndPointService = TestBed.get(PartnerAnalyticsEndPointService);
    expect(service).toBeTruthy();
  });
});
