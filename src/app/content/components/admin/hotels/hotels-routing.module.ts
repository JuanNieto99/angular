import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HotelsComponent } from './hotels.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: HotelsComponent }
	])],
	exports: [RouterModule]
})
export class HotelsRoutingModule { }
