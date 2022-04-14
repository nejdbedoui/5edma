import { TestBed } from '@angular/core/testing';

import { BonCommandeService } from './bon-commande.service';

describe('BonCommandeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BonCommandeService = TestBed.get(BonCommandeService);
    expect(service).toBeTruthy();
  });
});
