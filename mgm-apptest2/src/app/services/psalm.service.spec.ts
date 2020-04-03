import { TestBed } from '@angular/core/testing';

import { PsalmService } from './psalm.service';

describe('PsalmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PsalmService = TestBed.get(PsalmService);
    expect(service).toBeTruthy();
  });
});
