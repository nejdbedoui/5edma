import { TestBed } from '@angular/core/testing';

import { UtilisateurEndPointService } from './utilisateur-end-point.service';

describe('UtilisateurEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilisateurEndPointService = TestBed.get(UtilisateurEndPointService);
    expect(service).toBeTruthy();
  });
});
