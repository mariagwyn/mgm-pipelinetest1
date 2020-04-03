import { TestBed } from '@angular/core/testing';

import { LiturgyService } from './liturgy.service';

describe('LiturgyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiturgyService = TestBed.get(LiturgyService);
    expect(service).toBeTruthy();
  });
});
