import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionsComponent } from './permissions.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PermissionsComponent }
	])],
	exports: [RouterModule]
})
export class PermissionsRoutingModule { }