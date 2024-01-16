import { TestBed } from '@angular/core/testing';

import { TypeRoomsService } from './type-rooms.service';

describe('TypeRoomsService', () => {
  let service: TypeRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
