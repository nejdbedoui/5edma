import { TestBed } from '@angular/core/testing';

import { OperationTypeEndPointService } from './operation-type-end-point.service';

describe('OperationTypeEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperationTypeEndPointService = TestBed.get(OperationTypeEndPointService);
    expect(service).toBeTruthy();
  });
});
