import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelsService } from 'src/app/content/service/admin/hotels.service';
import { UsersService } from 'src/app/content/service/admin/users.service';
import { Permit } from 'src/app/content/models/admin/permissions.model';
import { PermissionsService } from 'src/app/content/service/admin/permissions.service'
import { BreadcrumbService } from 'src/app/content/service/breadcrumb.service';
import { DialogModule } from 'primeng/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastItem, ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';  
import Swal from 'sweetalert2/dist/sweetalert2.all.js';


@Component({
    selector: 'app-permisssions',
    templateUrl: './permissions.component.html',
    providers: [ConfirmationService, MessageService]
})
export class PermissionsComponent implements OnInit {

    
    public editarH: boolean = false;
    public crearH:boolean = false;

    ////// Variables de obtencion de datos
    public permission: Permit[];
    public totalPermission:any;

    /// Variables para abrir modals
    public editarPermit: boolean = false;
    public crearPermit: boolean = false;
    public permissionData: any;
    public param: any;
 
    ///////// Forms Groups ////////////    
    formNewP= new FormGroup({
        nombre: new FormControl('', Validators.required),
        codigo: new FormControl('', Validators.required,),
        descripcion: new FormControl('', Validators.required,)
    });

    formEditP = new FormGroup({
        nombre: new FormControl('', Validators.required),
        codigo: new FormControl('', Validators.required,),
        id: new FormControl('', Validators.required,)
    });
    changeDetector: any;
    
    ///////// Forms Groups ////////////  
    constructor(private permissionsService:PermissionsService, private hotelsService:HotelsService, private confirmationService: ConfirmationService, private toastModule: ToastModule, private dialogModule: DialogModule , private messageService: MessageService, private usersService: UsersService, private breadcrumbService: BreadcrumbService, private tableModule: TableModule, private buttonModule: ButtonModule, private cdRef: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        // Inicializamos la consulta de hoteles
        this.getAllPermissions();
        this.permissionsService.data.subscribe(permission => {
            this.permission = permission;
        });
        
    }
    //////// Crear un nuevo Permiso //////////////////
    createPermission(){
        const datos = this.formNewP.value;
        this.formNewP.reset();
        this.permissionsService.CreatePermissions(datos).subscribe(response => { 
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Usuario creado.',sticky: true, life: 200, });
            this.crearPermit = false;
            this.getAllPermissions();
        }, error => {
        console.log('Error:', error);
        });
    }
    /////// Consultar Todos los Permisos  ///////////
    getAllPermissions(): void {
        this.permissionsService.getPermissions(30).subscribe(
            (response: any) => {
                /* console.log('Response: ', response); */
                this.permission = response.data;
                this.totalPermission = response.total;  
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }
    /////////// Consultar 1 hotel  //////////////
    getPermission(id:number){
        this.permissionsService.getPermissionById(id).subscribe(response => {
            this.permissionData = response;
            console.log(this.permissionData);  
            this.formEditP.get('nombre').setValue(response.nombre);
            this.formEditP.get('codigo').setValue(response.codigo);
            this.formEditP.get('codigo').disable();
            this.formEditP.get('id').setValue(response.id); 
            this.editarPermit = true;
        })
    }

    /////////// Editar Permisos //////////////
    updatePermission(){
        this.formEditP.get('id').setValue(this.permissionData.id);
        const datos = this.formEditP.value;
        console.log(datos);
        this.permissionsService.updatePermissions(datos).subscribe( response => {
            //Cierra el modal de edición
            console.log(response);
            this.editarPermit = false;
            //this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Usuario actualizado.',sticky: true, life: 200, });
             //Actualiza la tabla de usuarios con el nuevo registro
            this.permissionsService. refresPermissionData();
            //Actualiza la tabla de usuarios con el nuevo registro
        }, error =>{
            console.log('Error:', error)
        });
    }

    confirmDelete(id:number){
        console.log(id);
        Swal.fire({
            title: "¿Estas Seguro que deseas eliminar el Permiso?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                this.permissionsService.deletePermissions(id).subscribe( response =>{
                    console.log(response);
                    this.permissionsService.refresPermissionData();
                });
                Swal.fire({
                title: "Confirmación",
                text: "El Permiso ha sido eliminado.",
                icon: "success"
            });
        }
        });
    }    

    modalNewP(){
        this.crearPermit = true;
    }
    
    

    
}
