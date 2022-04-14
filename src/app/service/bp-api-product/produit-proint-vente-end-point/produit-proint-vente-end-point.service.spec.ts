import { TestBed } from '@angular/core/testing';

import { ProduitProintVenteEndPointService } from './produit-proint-vente-end-point.service';

describe('ProduitProintVenteEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProduitProintVenteEndPointService = TestBed.get(ProduitProintVenteEndPointService);
    expect(service).toBeTruthy();
  });
});
