import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCalendarComponent } from './dashboard-calendar.component';

describe('DashboardCalendarComponent', () => {
  let component: DashboardCalendarComponent;
  let fixture: ComponentFixture<DashboardCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardCalendarComponent]
    });
    fixture = TestBed.createComponent(DashboardCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
