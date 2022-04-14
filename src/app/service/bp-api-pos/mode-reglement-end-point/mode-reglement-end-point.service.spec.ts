import { TestBed } from '@angular/core/testing';

import { ModeReglementEndPointService } from './mode-reglement-end-point.service';

describe('ModeReglementEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModeReglementEndPointService = TestBed.get(ModeReglementEndPointService);
    expect(service).toBeTruthy();
  });
});
