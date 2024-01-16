import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './content/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LandingComponent } from './content/components/landing/landing.component';
import { LoginGuard } from './content/guards/login.guard';
import { LoginBlockGuard } from './content/guards/loginblock.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: LandingComponent,
                children: [
                    { path: '', loadChildren: () => import('./content/components/landing/landing.module').then(m => m.LandingModule) },
                ]

            },
            {path:'dashboard', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./content/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'admin/users', loadChildren: () => import('./content/components/admin/users/users.module').then(m => m.UsersModule) },
                    { path: 'admin/hotels', loadChildren: () => import('./content/components/admin/hotels/hotels.module').then(m => m.HotelsModule) },
                    { path: 'admin/roles', loadChildren: () => import('./content/components/admin/roles/roles.module').then(m => m.RolesModule) },
                    { path: 'admin/permissions', loadChildren: () => import('./content/components/admin/permissions/permissions.module').then(m => m.PermissionsModule) },
                    { path: 'admin/wallets', loadChildren: () => import('./content/components/admin/wallets/wallets.module').then(m => m.WalletsModule) },
                    { path: 'products', loadChildren: () => import('./content/components/dashboard/products/products.module').then(m => m.ProductsModule) },
                    { path: 'inventory', loadChildren: () => import('./content/components/dashboard/inventory/inventory.module').then(m => m.InventoryModule) },
                    { path: 'typeRooms', loadChildren: () => import('./content/components/admin/type-rooms/type-rooms.module').then(m => m.TypeRoomsModule) }

                ],
                canActivate: [LoginGuard]
            },

            { path: 'auth', loadChildren: () => import('./content/components/auth/auth.module').then(m => m.AuthModule), canActivate: [LoginBlockGuard] },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
