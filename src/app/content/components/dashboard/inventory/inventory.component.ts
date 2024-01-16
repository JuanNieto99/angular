import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Hotel } from 'src/app/content/models/admin/hotels.model';
import { InventoryService } from 'src/app/content/service/dashboard/inventory.service';
import { WalletService } from 'src/app/content/service/admin/wallet.service';
import { Wallet } from 'src/app/content/models/admin/wallets.model';
import { HotelsService } from 'src/app/content/service/admin/hotels.service';
import { UsersService } from 'src/app/content/service/admin/users.service';
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
import { Inventory } from 'src/app/content/models/dashboard/inventory.model';


@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    providers: [ConfirmationService, MessageService]
})
export class InventoryComponent implements OnInit {

    /// Variables para la obtencion de inventarios
    public inventories: Inventory[];
    public totalInventories: any;
    public inventoryData:any;

    ///// Variables para obtencion de datos
    public wallets: Wallet[];
    public totalWallets: any;
    public walletData: any;

    public hotels: Hotel[];
    public selectedHotel: any;
    public tipo:any = 1;


    public editarW: boolean = false;
    public crearW:boolean = false;

    ////// Variables de obtencion de datos
    public permission: Permit[];
    public totalPermission:any;

    /// Variables para abrir modals
    public editarPermit: boolean = false;
    public crearPermit: boolean = false;
    public permissionData: any;
    public param: any;
 
    ///////// Forms Groups ////////////    
    formNewInventory= new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required),
        hotel_id: new FormControl('', Validators.required)
     });

     formEditInventory = new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required),
        hotel_id: new FormControl('', Validators.required),
        id: new FormControl('', Validators.required)
     });
    changeDetector: any;
    
    ///////// Forms Groups ////////////  
    constructor(private inventoryService: InventoryService, private walletService:WalletService, private permissionsService:PermissionsService, private hotelsService:HotelsService, private confirmationService: ConfirmationService, private toastModule: ToastModule, private dialogModule: DialogModule , private messageService: MessageService, private usersService: UsersService, private breadcrumbService: BreadcrumbService, private tableModule: TableModule, private buttonModule: ButtonModule, private cdRef: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        // Inicializamos la consulta de hoteles
        this.getAllHotels();
        // iniciamos la consulta de cajas
        this.getAllInventories();
        this.inventoryService.data.subscribe(inventory => {
            this.inventories = inventory;
        });
        
    }
    //////// Lista de Hoteles ////////
    getAllHotels(): void {
        this.hotelsService.getHotels(30).subscribe(
            (response: any) => {
                /* console.log('Response: ', response); */
                this.hotels = response.data;
                console.log(this.hotels);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }
    //////// Crear un nuevo Permiso //////////////////
    createInventory(){
        this.formNewInventory.get('hotel_id').setValue(this.selectedHotel.id);
        const datos = this.formNewInventory.value;
        this.inventoryService.createInventory(datos).subscribe(response => {
            console.log(response);
            this.inventoryService.refresInventaryData();
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Inventario Creado.',sticky: true, life: 200, });
            this.crearW = false;
          }, error => {
            console.log('Error:', error);
          });
    }
    /////// Consultar Todos los inventarios ///////////
    getAllInventories(): void {
        this.inventoryService.getInventories(30).subscribe(
            (response: any) => {
                /* console.log('Response: ', response); */
                this.inventories = response.data;
                this.totalInventories = response.total;
                console.log(this.inventories);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }
    /////////// Consultar 1 hotel  //////////////
    getInventory(id:number){
        this.inventoryService.getInventoryById(id).subscribe(response => {
            this.inventoryData = response;
            console.log(this.inventoryData);  
            this.editarW = true;
        })
    }

    /////////// Editar Permisos //////////////
    updateInventory(){
        this.formEditInventory.get('id').setValue(this.inventoryData.id);
        this.formEditInventory.get('hotel_id').setValue(this.selectedHotel.id);
        const datos = this.formEditInventory.value;
        console.log(datos);
        this.inventoryService.updateInventory(datos).subscribe( response => {
            //Cierra el modal de edición
            console.log(response);
            this.editarW = false;
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Inventario actualizado.',sticky: true, life: 200, });
             //Actualiza la tabla de usuarios con el nuevo registro
            this.inventoryService.refresInventaryData();
            //Actualiza la tabla de usuarios con el nuevo registro
        }, error =>{
            console.log('Error:', error)
        });
    }
    confirmDelete(id:number){
        console.log(id);
        Swal.fire({
            title: "¿Estas Seguro que deseas eliminar este inventario?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
                this.inventoryService.deleteInventry(id).subscribe( response =>{
                    console.log(response);
                    this.inventoryService.refresInventaryData();
                });
                Swal.fire({
                title: "Confirmación",
                text: "La caja ha sido eliminada.",
                icon: "success"
              });
            }
          });
    }    
    modalNewW(){
        this.crearW = true;
    }
    
    

    
}
