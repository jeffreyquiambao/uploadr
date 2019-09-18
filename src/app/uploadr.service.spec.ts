import { TestBed } from '@angular/core/testing';

import { UploadrService } from './uploadr.service';

describe('UploadrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadrService = TestBed.get(UploadrService);
    expect(service).toBeTruthy();
  });
});
