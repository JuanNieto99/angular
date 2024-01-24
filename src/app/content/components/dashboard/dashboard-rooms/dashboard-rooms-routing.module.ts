import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoomsComponent } from './dashboard-rooms.component';

const routes: Routes = [];

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DashboardRoomsComponent }
	])],
	exports: [RouterModule]
})
export class DashboardRoomsRoutingModule { }
