import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipesProductsComponent } from './recipes-products/recipes-products.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
		{ path: '', component: RecipesComponent },
        { path: ':id/recipes-products', component: RecipesProductsComponent }
	])],
	exports: [RouterModule]
})
export class RecipesRoutingModule { }
