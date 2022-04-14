import { TestBed } from '@angular/core/testing';

import { RegleUtilisationFideliteEndPointService } from './regle-utilisation-fidelite-end-point.service';

describe('RegleUtilisationFideliteEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegleUtilisationFideliteEndPointService = TestBed.get(RegleUtilisationFideliteEndPointService);
    expect(service).toBeTruthy();
  });
});
