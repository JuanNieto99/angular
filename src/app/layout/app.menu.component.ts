import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Tablero',
                items: [
                    { label: 'Habitaciones', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard/dashboardRooms'] },
                    { label: 'Reservas', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/calendar'] },
                    { label: 'Venta', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/dashboard/dashboardSell'] },
                  //  { label: 'Clientes', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/clients'] },
                  //  { label: 'Facturación', icon: 'pi pi-fw pi-calculator', routerLink: ['/dashboard/cash-register'] }
                ]
            },
            {
                label: 'Configurar',
                items: [
                    /*{ label: 'Hotel', icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Habitaciones',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/dashboard/rooms']
                            },
                            {
                                label: 'Usuarios',
                                icon: 'pi pi-fw pi-user-edit',
                                routerLink: ['/dashboard/users']
                            },
                            {
                                label: 'Permisos',
                                icon: 'pi pi-fw pi-unlock',
                                routerLink: ['/dashboard/permission']
                            },
                            {
                                label: 'Roles',
                                icon: 'pi pi-fw pi-check-circle',
                                routerLink: ['/dashboard/roles']
                            }
                        ]
                    },*/
                    { label: 'Inventario', icon: 'pi pi-fw pi-cart-plus',
                        items: [
                            {
                                label: 'Productos',
                                icon: 'pi pi-fw pi-star',
                                routerLink: ['/dashboard/products']
                            },
                            {
                                label: 'Inventario',
                                icon: 'pi pi-fw pi-server',
                                routerLink: ['/dashboard/inventory']
                            },
                            {label: 'Recetas', icon: 'pi pi-book', routerLink: ['/dashboard/admin/recipes']},
                        ]
                    },
                    { //
                        label: 'Administrar',
                        icon: 'pi pi-fw pi-sliders-h',
                        items: [
                            { label: 'Hoteles', icon: 'pi pi-building', routerLink: ['/dashboard/admin/hotels'] },
                            { label: 'Usuarios', icon: 'pi pi-fw pi-user-plus', routerLink: ['/dashboard/admin/users'] },
                            { label: 'Roles', icon: 'pi pi-users', routerLink: ['/dashboard/admin/roles'] },
                            { label: 'Permisos', icon: 'pi pi-key', routerLink: ['/dashboard/admin/permissions'] },
                            { label: 'Clientes', icon: 'pi pi-users', routerLink: ['/dashboard/admin/clientes'] }, 
                            { label: 'Tipo Habitación', icon: 'pi pi-table', routerLink: ['/dashboard/typeRooms'] },
                            { label: 'Secuencia Interna', icon: 'pi pi-fw pi-book', routerLink: ['/dashboard/admin/internalSequence'] },
                            { label: 'Secuencia Externa', icon: 'pi pi-fw pi-book', routerLink: ['/dashboard/admin/externalSequence'] },
                            { label: 'Habitaciones', icon: 'pi pi-home', routerLink: ['/dashboard/admin/rooms'] },
                            {label: 'Tarifa', icon: 'pi pi-tag', routerLink: ['/dashboard/admin/tarifas']}
                        ]
                    },

                    { label: 'Gestion Cajas', icon: 'pi pi-wallet', items: [
                        {
                            label: 'Cajas', icon: 'pi pi-wallet', routerLink: ['/dashboard/admin/wallets']
                        },
                        {
                            label: 'Cajas Abrir', icon: 'pi pi-wallet', routerLink: ['/dashboard/admin/wallets/detail']
                        }
                    ] },
                ]
            },





        ];
    }
}
