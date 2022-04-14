import { TestBed } from '@angular/core/testing';

import { CategorieEndPointService } from './categorie-end-point.service';

describe('CategorieEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategorieEndPointService = TestBed.get(CategorieEndPointService);
    expect(service).toBeTruthy();
  });
});
