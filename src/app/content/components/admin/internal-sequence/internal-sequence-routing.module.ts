import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalSequenceComponent } from './internal-sequence.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: InternalSequenceComponent }
  ])],
    exports: [RouterModule]
})
export class InternalSequenceRoutingModule { }
