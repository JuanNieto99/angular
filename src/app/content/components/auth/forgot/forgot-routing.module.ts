import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForgotComponent } from './forgot.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ForgotComponent }
    ])],
    exports: [RouterModule]
})
export class ForgotRoutingModule { }