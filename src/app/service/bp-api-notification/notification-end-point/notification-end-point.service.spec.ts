import { TestBed } from '@angular/core/testing';

import { NotificationEndPointService } from './notification-end-point.service';

describe('NotificationEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationEndPointService = TestBed.get(NotificationEndPointService);
    expect(service).toBeTruthy();
  });
});
