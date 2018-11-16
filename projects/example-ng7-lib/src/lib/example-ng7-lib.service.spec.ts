import { TestBed } from '@angular/core/testing';

import { ExampleNg7LibService } from './example-ng7-lib.service';

describe('ExampleNg7LibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExampleNg7LibService = TestBed.get(ExampleNg7LibService);
    expect(service).toBeTruthy();
  });
});
