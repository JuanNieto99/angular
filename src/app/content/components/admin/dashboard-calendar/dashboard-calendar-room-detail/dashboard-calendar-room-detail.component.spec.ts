import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCalendarRoomDetailComponent } from './dashboard-calendar-room-detail.component';

describe('DashboardCalendarRoomDetailComponent', () => {
  let component: DashboardCalendarRoomDetailComponent;
  let fixture: ComponentFixture<DashboardCalendarRoomDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardCalendarRoomDetailComponent]
    });
    fixture = TestBed.createComponent(DashboardCalendarRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
