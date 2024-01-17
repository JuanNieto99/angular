import { TestBed } from '@angular/core/testing';

import { InternalSequenceService } from './internal-sequence.service';

describe('InternalSequenceService', () => {
  let service: InternalSequenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalSequenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
