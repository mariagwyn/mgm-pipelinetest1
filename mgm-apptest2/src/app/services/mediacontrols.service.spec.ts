import { TestBed } from '@angular/core/testing';

import { MediacontrolsService } from './mediacontrols.service';

describe('MediacontrolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediacontrolsService = TestBed.get(MediacontrolsService);
    expect(service).toBeTruthy();
  });
});
