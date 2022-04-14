import { TestBed } from '@angular/core/testing';

import { OperationEndPointService } from './operation-end-point.service';

describe('OperationEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperationEndPointService = TestBed.get(OperationEndPointService);
    expect(service).toBeTruthy();
  });
});
