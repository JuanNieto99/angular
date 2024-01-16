import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelsService } from 'src/app/content/service/admin/hotels.service';
import { UsersService } from 'src/app/content/service/admin/users.service';
import { Rol } from 'src/app/content/models/admin/roles.model';
import { RolesService } from 'src/app/content/service/admin/roles.service';
import { Permit } from 'src/app/content/models/admin/permissions.model';
import { PermissionsService } from 'src/app/content/service/admin/permissions.service'
import { BreadcrumbService } from 'src/app/content/service/breadcrumb.service';
import { DialogModule } from 'primeng/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';  
import Swal from 'sweetalert2/dist/sweetalert2.all.js';


@Component({
    selector: 'app-permisssions',
    templateUrl: './roles.component.html',
    providers: [ConfirmationService, MessageService]
})
export class RolesComponent implements OnInit {

    ////// Variables de obtencion de datos
    public roles: Rol[];
    public totalRoles:any;
    public rolesData: any;
    
    /// Variables para abrir modals
    public crearRol: boolean = false;
    public editarRol: boolean = false;


 
    ///////// Forms Groups ////////////    
    formNewR= new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required,),
        estado: new FormControl('', Validators.required,)
     });

     formEditR = new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required),
        id: new FormControl('', Validators.required,)
     });
    changeDetector: any;
    
    ///////// Forms Groups ////////////  
    constructor(private rolesService:RolesService, private permissionsService:PermissionsService, private hotelsService:HotelsService, private confirmationService: ConfirmationService, private toastModule: ToastModule, private dialogModule: DialogModule , private messageService: MessageService, private usersService: UsersService, private breadcrumbService: BreadcrumbService, private tableModule: TableModule, private buttonModule: ButtonModule, private cdRef: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        // Inicializamos la consulta de hoteles
        this.getAllRoles();
        this.rolesService.data.subscribe(roles => {
            this.roles = roles;
            console.log(this.roles);
        });
        
    }
    //////// Crear un nuevo Permiso //////////////////
    createRol(){
        const datos = this.formNewR.value;
        this.formNewR.reset();
        this.rolesService.CreateRoles(datos).subscribe(response => {
            console.log(response);
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Rol creado.',sticky: true, life: 200, });
            this.crearRol = false;
            this.rolesService.refresRolesData();
        }, error => {
            console.log('Error:', error);
        });
    }
    /////// Consultar Todos los Permisos  ///////////
    getAllRoles(): void {
        this.rolesService.getRoles(30).subscribe(
            (response: any) => {
                /* console.log('Response: ', response); */
                this.roles = response.data;
                this.totalRoles = response.total;
                console.log(this.roles);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }
    /////////// Consultar 1 hotel  //////////////
    getRol(id:number){
        this.rolesService.getRolesById(id).subscribe(response => {
            this.rolesData = response; 
            this.formEditR.get('nombre').setValue(response.nombre) 
            this.formEditR.get('descripcion').setValue(response.descripcion) 
            this.editarRol = true;
        })
    }

    /////////// Editar Permisos //////////////
    updateRoles(){
        this.formEditR.get('id').setValue(this.rolesData.id);
        const datos = this.formEditR.value;
        console.log(datos);
        this.rolesService.updateRoles(datos).subscribe( response => {
            //Cierra el modal de edición
            console.log(response);
            this.editarRol = false;
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Rol actualizado.',sticky: true, life: 200, });
             //Actualiza la tabla de Roles con el nuevo registro
            this.rolesService.refresRolesData();
        }, error =>{
            console.log('Error:', error)
        });
    }
    confirmDelete(id:number){
        console.log(id);
        Swal.fire({
            title: "¿Estas Seguro que deseas eliminar el Rol?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
          }).then((result) => { 
            if (result.isConfirmed) {
                this.rolesService.deleteRoles(id).subscribe( response =>{
                    console.log(response);
                    this.rolesService.refresRolesData();
                });
                Swal.fire({
                title: "Confirmación",
                text: "El Rol ha sido eliminado.",
                icon: "success"
              });
            }
          });
    }    
    modalNewP(){
        this.crearRol = true;
    }
    
    

    
}
