import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProductsTributeComponent } from './products/products-tribute/products-tribute.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
