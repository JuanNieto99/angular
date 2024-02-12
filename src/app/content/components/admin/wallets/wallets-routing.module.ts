import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WalletsComponent } from './wallets.component';
import { DetailsWalletsComponent } from './details-wallets/details-wallets.component';
import { DetailsWalletsListComponent } from './details-wallets-list/details-wallets-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: WalletsComponent },
		{ path: ':id/abrirCaja', component: DetailsWalletsComponent },
		{ path: 'detail', component: DetailsWalletsListComponent }
	])],
	exports: [RouterModule]
})
export class WalletsRoutingModule { }