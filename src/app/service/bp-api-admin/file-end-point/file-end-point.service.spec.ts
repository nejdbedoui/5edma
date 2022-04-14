import { TestBed } from '@angular/core/testing';

import { FileEndPointService } from './file-end-point.service';

describe('FileEndPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileEndPointService = TestBed.get(FileEndPointService);
    expect(service).toBeTruthy();
  });
});
