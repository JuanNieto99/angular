import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCalendarComponent } from './dashboard-calendar.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: DashboardCalendarComponent }
  ])],
    exports: [RouterModule]
})
export class DashboardCalendarRoutingModule { }
