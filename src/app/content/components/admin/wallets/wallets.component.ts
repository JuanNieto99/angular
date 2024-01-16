import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Hotel } from 'src/app/content/models/admin/hotels.model';
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


@Component({
    selector: 'app-permisssions',
    templateUrl: './wallets.component.html',
    providers: [ConfirmationService, MessageService]
})
export class WalletsComponent implements OnInit {

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
    formNewWallet= new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        base: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required),
        hotel_id: new FormControl('', Validators.required),
        tipo: new FormControl('', Validators.required)
    });

    formEditWallet = new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        base: new FormControl('', Validators.required),
        estado: new FormControl('', Validators.required),
        hotel_id: new FormControl('', Validators.required),
        tipo: new FormControl('', Validators.required),
        id: new FormControl('', Validators.required)
    });

    changeDetector: any;
    
    ///////// Forms Groups ////////////  
    constructor(private walletService:WalletService, private permissionsService:PermissionsService, private hotelsService:HotelsService, private confirmationService: ConfirmationService, private toastModule: ToastModule, private dialogModule: DialogModule , private messageService: MessageService, private usersService: UsersService, private breadcrumbService: BreadcrumbService, private tableModule: TableModule, private buttonModule: ButtonModule, private cdRef: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        // Inicializamos la consulta de hoteles
        this.getAllHotels();
        // iniciamos la consulta de cajas
        this.getAllWallets();
        this.walletService.data.subscribe(wallets => {
            this.wallets = wallets;
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
    createWallet(){   
        this.formNewWallet.get('hotel_id').setValue(this.selectedHotel.id);
        this.formNewWallet.get('tipo').setValue(this.tipo);
        const datos = this.formNewWallet.value;
        this.walletService.CreateWallet(datos).subscribe(response => {
            console.log(response);
            this.walletService.refresWalletsData();
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Caja Creada.',sticky: true, life: 200, });
            this.crearW = false;
        // this.getAllWallets();
        }, error => {
            console.log('Error:', error);
        }); 
    }


    /////// Consultar Todos los Permisos  ///////////
    getAllWallets(): void {
        this.walletService.getWallets(30).subscribe(
            (response: any) => { 
                this.wallets = response.data;
                this.totalWallets = response.total; 
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }
    /////////// Consultar 1 hotel  //////////////
    getWallet(id:number){ 
        this.walletService.getWallteEditById(id).subscribe(response => {
            this.walletData = response;
            
            let hotel: string;  
            response.hotel.forEach(element => {
                if(element.id==response.caja.hotel_id){
                    hotel = element;
                }
            }); 

            console.log(hotel)

            this.formEditWallet.get('nombre').setValue(response.nombre)
            this.formEditWallet.get('base').setValue(response.base)
            this.formEditWallet.get('descripcion').setValue(response.descripcion)
            this.formEditWallet.get('hotel_id').setValue(hotel)
            this.editarW = true;
        })
    }

    /////////// Editar Permisos //////////////
    updateWallet(){
        this.formEditWallet.get('id').setValue(this.walletData.id);
        this.formEditWallet.get('hotel_id').setValue(this.selectedHotel.id);
        this.formEditWallet.get('tipo').setValue(this.tipo);
        const datos = this.formEditWallet.value;
        console.log(datos);
        this.walletService.updateWallets(datos).subscribe( response => {
            //Cierra el modal de edición
            console.log(response);
            this.editarW = false;
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Caja actualizada.',sticky: true, life: 200, });
             //Actualiza la tabla de usuarios con el nuevo registro
            this.walletService.refresWalletsData();
            //Actualiza la tabla de usuarios con el nuevo registro
        }, error =>{
            console.log('Error:', error)
        });
    }

    confirmDelete(id:number){
        console.log(id);
        Swal.fire({
            title: "¿Estas Seguro que deseas eliminar esta caja?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
                this.walletService.deleteWallets(id).subscribe( response =>{
                    console.log(response);
                    this.walletService.refresWalletsData();
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
