import { TestBed } from '@angular/core/testing';

import { GroupeClientPartenaireEndPointService } from './groupe-client-partenaire-end-point.service';

describe('GroupeClientPartenaireEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupeClientPartenaireEndPointService = TestBed.get(GroupeClientPartenaireEndPointService);
    expect(service).toBeTruthy();
  });
});
