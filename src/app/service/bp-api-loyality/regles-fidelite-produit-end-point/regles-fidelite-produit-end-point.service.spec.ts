import { TestBed } from '@angular/core/testing';

import { ReglesFideliteProduitEndPointService } from './regles-fidelite-produit-end-point.service';

describe('ReglesFideliteProduitEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReglesFideliteProduitEndPointService = TestBed.get(ReglesFideliteProduitEndPointService);
    expect(service).toBeTruthy();
  });
});
