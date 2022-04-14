import { TestBed } from '@angular/core/testing';

import { MvtSoldeEndPointService } from './mvt-solde-end-point.service';

describe('MvtSoldeEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MvtSoldeEndPointService = TestBed.get(MvtSoldeEndPointService);
    expect(service).toBeTruthy();
  });
});
