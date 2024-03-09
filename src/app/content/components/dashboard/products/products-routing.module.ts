import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductsTributeComponent } from './products-tribute/products-tribute.component';

const routes: Routes = [];

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProductsComponent },
		{ path: ':id/impuesto', component: ProductsTributeComponent }
	])],
	exports: [RouterModule]
})
export class ProductsRoutingModule { }
