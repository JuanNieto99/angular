import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TarifaComponent } from './tarifa.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(
    [
      { path: '', component: TarifaComponent }
    ]
  )],
  exports: [RouterModule]
})
export class TarifaRoutingModule { }
