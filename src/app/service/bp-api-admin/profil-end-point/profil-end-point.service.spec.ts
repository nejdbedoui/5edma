import { TestBed } from '@angular/core/testing';

import { ProfilEndPointService } from './profil-end-point.service';

describe('ProfilEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfilEndPointService = TestBed.get(ProfilEndPointService);
    expect(service).toBeTruthy();
  });
});
