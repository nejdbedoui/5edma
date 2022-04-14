import { TestBed } from '@angular/core/testing';

import { UtilisateurTypeEndPointService } from './utilisateur-type-end-point.service';

describe('UtilisateurTypeEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilisateurTypeEndPointService = TestBed.get(UtilisateurTypeEndPointService);
    expect(service).toBeTruthy();
  });
});
