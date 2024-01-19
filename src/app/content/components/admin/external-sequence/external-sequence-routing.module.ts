import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalSequenceComponent } from './external-sequence.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ExternalSequenceComponent }
  ])],
    exports: [RouterModule]
})
export class ExternalSequenceRoutingModule { }
