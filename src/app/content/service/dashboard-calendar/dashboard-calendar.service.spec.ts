import { TestBed } from '@angular/core/testing';

import { DashboardCalendarService } from './dashboard-calendar.service';

describe('DashboardCalendarService', () => {
  let service: DashboardCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
