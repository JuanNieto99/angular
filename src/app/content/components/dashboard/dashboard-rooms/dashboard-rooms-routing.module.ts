import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoomsComponent } from './dashboard-rooms.component';
import { DashboardRoomsOcuparComponent } from './dashboard-rooms-ocupar/dashboard-rooms-ocupar.component';

const routes: Routes = [];

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DashboardRoomsComponent },
		{ path: ':idHabitacion/ocupar', component: DashboardRoomsOcuparComponent }
	])],
	exports: [RouterModule]
})
export class DashboardRoomsRoutingModule { }
