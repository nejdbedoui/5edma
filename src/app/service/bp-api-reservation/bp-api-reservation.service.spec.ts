import { TestBed } from '@angular/core/testing';

import { BpApiReservationService } from './bp-api-reservation.service';

describe('BpApiReservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BpApiReservationService = TestBed.get(BpApiReservationService);
    expect(service).toBeTruthy();
  });
});
