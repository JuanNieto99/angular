import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
		{ path: '', component: RecipesComponent }
	])],
	exports: [RouterModule]
})
export class RecipesRoutingModule { }
