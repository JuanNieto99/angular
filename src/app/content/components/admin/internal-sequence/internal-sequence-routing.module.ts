import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeRoomsComponent } from '../type-rooms/type-rooms.component';

const routes: Routes = [];

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  //exports: [RouterModule]
  imports: [RouterModule.forChild([
    { path: '', component: TypeRoomsComponent }
  ])],
    exports: [RouterModule]
})
export class InternalSequenceRoutingModule { }
