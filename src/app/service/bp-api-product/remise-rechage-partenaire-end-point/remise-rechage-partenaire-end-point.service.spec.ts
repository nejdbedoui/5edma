import { TestBed } from '@angular/core/testing';

import { RemiseRechagePartenaireEndPointService } from './remise-rechage-partenaire-end-point.service';

describe('RemiseRechagePartenaireEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemiseRechagePartenaireEndPointService = TestBed.get(RemiseRechagePartenaireEndPointService);
    expect(service).toBeTruthy();
  });
});
