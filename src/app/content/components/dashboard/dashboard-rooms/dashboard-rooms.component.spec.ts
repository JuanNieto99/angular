import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRoomsComponent } from './dashboard-rooms.component';

describe('DashboardRoomsComponent', () => {
  let component: DashboardRoomsComponent;
  let fixture: ComponentFixture<DashboardRoomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardRoomsComponent]
    });
    fixture = TestBed.createComponent(DashboardRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
