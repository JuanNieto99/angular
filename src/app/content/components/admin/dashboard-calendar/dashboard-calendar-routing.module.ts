import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCalendarComponent } from './dashboard-calendar.component';
import { DashboardCalendarRoomDetailComponent } from './dashboard-calendar-room-detail/dashboard-calendar-room-detail.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: DashboardCalendarComponent },
    { path: ':id/detailRoom', component: DashboardCalendarRoomDetailComponent }
  ])],
    exports: [RouterModule]
})
export class DashboardCalendarRoutingModule { }
