import { TestBed } from '@angular/core/testing';

import { FournisseurEndPointService } from './fournisseur-end-point.service';

describe('FournisseurEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FournisseurEndPointService = TestBed.get(FournisseurEndPointService);
    expect(service).toBeTruthy();
  });
});
