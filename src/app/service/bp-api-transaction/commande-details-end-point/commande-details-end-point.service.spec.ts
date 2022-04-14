import { TestBed } from '@angular/core/testing';

import { CommandeDetailsEndPointService } from './commande-details-end-point.service';

describe('CommandeDetailsEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommandeDetailsEndPointService = TestBed.get(CommandeDetailsEndPointService);
    expect(service).toBeTruthy();
  });
});
