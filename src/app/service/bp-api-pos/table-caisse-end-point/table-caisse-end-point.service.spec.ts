import { TestBed } from '@angular/core/testing';

import { TableCaisseEndPointService } from './table-caisse-end-point.service';

describe('TableCaisseEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableCaisseEndPointService = TestBed.get(TableCaisseEndPointService);
    expect(service).toBeTruthy();
  });
});
