import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/content/service/admin/users.service';
import { User } from 'src/app/content/models/admin/users.model';
import { BreadcrumbService } from 'src/app/content/service/breadcrumb.service';
import { DialogModule } from 'primeng/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    templateUrl: './users.component.html',
    providers: [ConfirmationService, MessageService]
})
export class UsersComponent implements OnInit {

    public users: User[];
    public userData: any;
    public usuarios:any;
    public breadcrumbs: string[]; // declarar e inicializar la variable breadcrumbs
    public totalUsers: number;
    public visible: boolean = false;
    public visibleDialog1:boolean = false;
    public selectedState: any = null;
    public selectedUserIndex = -1;
    public pageCount: number = 10;
    public pageActual: number = 1;
    public ultimaPage: number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;
    public loadingTable: boolean = false;
    public first: number = 0;
    public rows: number = 8;

    formSearch = new FormGroup({
        search: new FormControl('', []),
    });

    formNuser = new FormGroup({
        usuario: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        rol_id: new FormControl('', Validators.required),
        superadmin: new FormControl('', Validators.required),
        password:new FormControl('', Validators.required)

     });

     formEuser = new FormGroup({
        usuario: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        rol_id: new FormControl('', Validators.required),
        superadmin: new FormControl('', Validators.required),
        id: new FormControl('', Validators.required)
     });

    constructor(private confirmationService: ConfirmationService, private spinner: NgxSpinnerService, private toastModule: ToastModule, private dialogModule: DialogModule , private messageService: MessageService, private usersService: UsersService, private breadcrumbService: BreadcrumbService, private tableModule: TableModule, private buttonModule: ButtonModule ) {

    }

    ngOnInit(): void {
        this.getIndex();
        this.usersService.data.subscribe(users => {
            this.users = users;
            console.log(this.users);
        });
        this.breadcrumbService.currentBreadcrumbs.subscribe(breadcrumbs => this.breadcrumbs = breadcrumbs);
    }

    onQuitItem(item: string): void {
        this.breadcrumbService.quitItem(item);
    }

    getIndex(search: string = '', pageCount: number = this.pageCount, page: number = 1): void {
        this.spinner.show();
        this.loadingTable = true;
        this.usersService.getAll(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.users = response.data;
                this.ultimaPage = response.last_page;
                this.totalUsers = response.total;
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

    getAUser(id:number){
        this.usersService.getById(id).subscribe(response => {
            this.userData = response;
            this.userData.id = id;
            console.log(this.userData);
            this.visibleDialog1 = true;
        });
    }

    getRolName(rol: number): string {
        if (rol === 1){
            return 'Super Administrador';
        }else if (rol === 2) {
            return 'Administrador';
        } else if (rol === 3) {
            return 'Gestor';
        } else {
            return 'Rol no identificado';
        }
    }

    getStatusName(status: number): string {
        if (status === 1){
            return 'Activo';
        }else if (status === 0) {
            return 'Inactivo';
        }else {
            return 'Estado no identificado';
        }
    }

    openNew() {
        this.visible = true;
    }

    async newUser(){
        const datos = this.formNuser.value;
        this.usersService.insertData(datos).subscribe(response => {
            console.log(response);
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Usuario creado.',sticky: true, life: 200, });
            this.visible = false;
            this.usersService.refreshUsersData();
          }, error => {
            console.log('Error:', error);
          });
    }

    updateUser(){
        this.formEuser.get('id').setValue(this.userData.id);
        const datos = this.formEuser.value;
        this.usersService.updateUser(datos).subscribe( response => {
            //Cierra el modal de edición
            this.visibleDialog1 = false;
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Hotel actualizado.',sticky: true, life: 200, });
             //Actualiza la tabla de usuarios con el nuevo registro
             this.usersService.refreshUsersData();
            //Actualiza la tabla de usuarios con el nuevo registro
        }, error =>{
            console.log('Error:', error)
        });
    }

    deleteUser(id: number){
        const params = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            body: `id=${id}`
        };
        this.usersService.deleteUser(params).subscribe( response =>{

            this.usersService.refreshUsersData();
            console.log(response);
        }, error =>{
            console.log('Error:', error)
        });
    }

    confirmDelete(id:number){
        console.log(id);
        Swal.fire({
            title: "¿Estas Seguro que deseas eliminar el usuario?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
                this.deleteUser(id);
                Swal.fire({
                title: "Confirmación",
                text: "El usuario ha sido eliminado.",
                icon: "success"
              });
            }
          });
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
