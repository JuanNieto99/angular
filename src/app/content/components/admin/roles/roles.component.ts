import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelsService } from 'src/app/content/service/admin/hotels.service';
import { UsersService } from 'src/app/content/service/admin/users.service';
import { Rol } from 'src/app/content/models/admin/roles.model';
import { RolesService } from 'src/app/content/service/admin/roles.service';
import { Permit } from 'src/app/content/models/admin/permissions.model';
import { PermissionsService } from 'src/app/content/service/admin/permissions.service';
import { BreadcrumbService } from 'src/app/content/service/breadcrumb.service';
import { DialogModule } from 'primeng/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-permisssions',
    templateUrl: './roles.component.html',
    providers: [ConfirmationService, MessageService],
})
export class RolesComponent implements OnInit {
    ////// Variables de obtencion de datos
    public roles: Rol[];
    public totalRoles: any;
    public rolesData: any;
    public pageCount: number = 10;
    public pageActual: number = 1;
    public ultimaPage: number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;
    public loadingTable: boolean = false;
    public first: number = 0;
    public rows: number = 8;

    /// Variables para abrir modals
    public crearRol: boolean = false;
    public editarRol: boolean = false;

    ///////// Forms Groups ////////////
    formSearch = new FormGroup({
        search: new FormControl('', []),
    });

    formNewR = new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required),
    });

    formEditR = new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required),
        id: new FormControl('', Validators.required),
    });
    changeDetector: any;

    ///////// Forms Groups ////////////
    constructor(
        private rolesService: RolesService,
        private spinner: NgxSpinnerService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        // Inicializamos la consulta de hoteles
        this.getIndex();
        this.rolesService.data.subscribe((roles) => {
            this.roles = roles;
            console.log(this.roles);
        });
    }
    //////// Crear un nuevo Permiso //////////////////
    createRol() {
        const datos = this.formNewR.value;
        this.formNewR.reset();
        this.rolesService.CreateRoles(datos).subscribe(
            (response) => {
                console.log(response);
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmación Exitosa',
                    detail: 'Rol creado.',
                    sticky: true,
                    life: 200,
                });
                this.crearRol = false;
                this.rolesService.refresRolesData();
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }
    /////// Consultar Todos los Permisos  ///////////
    getIndex(search: string = '', pageCount: number = this.pageCount, page: number = 1): void {
        this.spinner.show();
        this.loadingTable = true;
        this.rolesService.getRoles(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.roles = response.data;
                this.ultimaPage = response.last_page;
                this.totalRoles = response.total;
                this.ultimaPage = response.last_page;
                if(response.total>pageCount){
                    this.disablePageRight = true;
                }
                this.validatePage();
                this.spinner.hide();
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }
    /////////// Consultar 1 hotel  //////////////
    getRol(id: number) {
        this.rolesService.getRolesById(id).subscribe((response) => {
            this.rolesData = response;
            this.formEditR.get('nombre').setValue(response.nombre);
            this.formEditR.get('descripcion').setValue(response.descripcion);
            this.editarRol = true;
        });
    }

    /////////// Editar Permisos //////////////
    updateRoles() {
        this.formEditR.get('id').setValue(this.rolesData.id);
        const datos = this.formEditR.value;
        console.log(datos);
        this.rolesService.updateRoles(datos).subscribe(
            (response) => {
                //Cierra el modal de edición
                console.log(response);
                this.editarRol = false;
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmación Exitosa',
                    detail: 'Rol actualizado.',
                    sticky: true,
                    life: 200,
                });
                //Actualiza la tabla de Roles con el nuevo registro
                this.rolesService.refresRolesData();
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }
    confirmDelete(id: number) {
        console.log(id);
        Swal.fire({
            title: '¿Estas Seguro que deseas eliminar el Rol?',
            text: 'Ten cuidado esta acción no se prodrá reversar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.rolesService.deleteRoles(id).subscribe((response) => {
                    console.log(response);
                    this.rolesService.refresRolesData();
                });
                Swal.fire({
                    title: 'Confirmación',
                    text: 'El Rol ha sido eliminado.',
                    icon: 'success',
                });
            }
        });
    }
    modalNewP() {
        this.crearRol = true;
    }

    //Buscar

    searchInput() {
        let search = this.formSearch.get('search').value;
        if (search == '') {
            this.getIndex(search);
        }
    }

    search(dt) {
        let search = this.formSearch.get('search').value;
        this.getIndex(search);
    }

    onPage(event) {
        this.pageCount = event['rows'];
        this.getIndex('', this.pageCount);
    }

    //Paginador

    onPageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
    }

    leftTable() {
        this.pageActual = this.pageActual - 1;
        this.getIndex('', this.pageCount, this.pageActual);
        this.validatePage();
    }

    rightTable() {
        this.pageActual = this.pageActual + 1;
        this.getIndex('', this.pageCount, this.pageActual);
        this.validatePage();
    }

    validatePage() {
        if (this.pageActual == 1) {
            this.disablePageLeft = false;
        }

        if (this.pageActual > 1) {
            this.disablePageLeft = true;
        }

        if (this.ultimaPage == this.pageActual) {
            this.disablePageRight = false;
        }

        if (this.ultimaPage > this.pageActual) {
            this.disablePageRight = true;
        }
    }
}
