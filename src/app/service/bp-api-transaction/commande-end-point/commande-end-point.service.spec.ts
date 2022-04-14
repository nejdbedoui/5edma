import { TestBed } from '@angular/core/testing';

import { CommandeEndPointService } from './commande-end-point.service';

describe('CommandeEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommandeEndPointService = TestBed.get(CommandeEndPointService);
    expect(service).toBeTruthy();
  });
});
