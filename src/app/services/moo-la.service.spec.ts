import { TestBed } from '@angular/core/testing';

import { MooLaService } from './moo-la.service';

describe('MooLaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MooLaService = TestBed.get(MooLaService);
    expect(service).toBeTruthy();
  });
});
