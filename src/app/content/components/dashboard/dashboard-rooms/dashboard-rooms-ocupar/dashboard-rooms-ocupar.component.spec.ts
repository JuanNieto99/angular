import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRoomsOcuparComponent } from './dashboard-rooms-ocupar.component';

describe('DashboardRoomsOcuparComponent', () => {
  let component: DashboardRoomsOcuparComponent;
  let fixture: ComponentFixture<DashboardRoomsOcuparComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardRoomsOcuparComponent]
    });
    fixture = TestBed.createComponent(DashboardRoomsOcuparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
