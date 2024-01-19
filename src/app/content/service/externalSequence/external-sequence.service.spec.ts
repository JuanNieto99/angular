import { TestBed } from '@angular/core/testing';

import { ExternalSequenceService } from './external-sequence.service';

describe('ExternalSequenceService', () => {
  let service: ExternalSequenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalSequenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
