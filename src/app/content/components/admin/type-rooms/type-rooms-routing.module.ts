import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { TypeRoomsComponent } from './type-rooms.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TypeRoomsComponent }
	])],
  exports: [RouterModule]
})
export class TypeRoomsRoutingModule { }
