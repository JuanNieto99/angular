import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from './rooms.component';

const routes: Routes = [];

@NgModule({
imports: [RouterModule.forChild([
        { path: '', component: RoomsComponent }
    ])],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
