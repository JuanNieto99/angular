import { TestBed } from '@angular/core/testing';

import { DashboardRoomsService } from './dashboard-rooms.service';

describe('DashboardRoomsService', () => {
  let service: DashboardRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
