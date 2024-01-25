import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HotelsService } from 'src/app/content/service/admin/hotels.service';
import { Observable, switchMap } from 'rxjs';
import { UsersService } from 'src/app/content/service/admin/users.service';
import { User } from 'src/app/content/models/admin/users.model';
import { Hotel } from 'src/app/content/models/admin/hotels.model';
import { BreadcrumbService } from 'src/app/content/service/breadcrumb.service';
import { DialogModule } from 'primeng/dialog';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-hotels',
    templateUrl: './hotels.component.html',
    providers: [ConfirmationService, MessageService]
})
export class HotelsComponent implements OnInit {


    public editarH: boolean = false;
    public crearH:boolean = false;

    // variables de Hoteles
    public hotels: Hotel[];
    public totalHotels:any;
    public hotelData:any;
    public param: any;
    public dataUser:any;
    public tcontribuyente: any = 1;

    //Variables para Paginador y Buscador

    public pageCount: number = 10;
    public pageActual: number = 1;
    public ultimaPage: number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = true;
    public first: number = 0;
    public rows: number = 8;
    public loadingTable: boolean = false;

    public countries$: any[] = [];
    public states$: any[] = [];
    public cities$: any[] = [];
    public selectedCountry: any;
    public selectedState: any;
    public selectedCity: any;

    ///////// Forms Groups ////////////
    formSearch = new FormGroup({
        search: new FormControl('', []),
    });

    formNewHotel = new FormGroup({
        nombre: new FormControl('', Validators.required),
        direccion: new FormControl('', [Validators.required, Validators.email]),
        ciudad_id: new FormControl('', Validators.required),
        contacto: new FormControl('', Validators.required),
        contacto_telefono:new FormControl('', Validators.required),
        contacto_cargo:new FormControl('', Validators.required),
        telefono:new FormControl('', Validators.required),
        nit:new FormControl('', Validators.required),
        razon_social:new FormControl('', Validators.required),
        cantidad_habitaciones:new FormControl('', Validators.required),
        usuario_id: new FormControl('', Validators.required),
        tipo_contribuyente: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required)
     });

     formEditHotel = new FormGroup({
        nombre: new FormControl('', Validators.required),
        cantidad_habitaciones: new FormControl('', [Validators.required, Validators.email]),
        contacto: new FormControl('', Validators.required),
        contacto_cargo: new FormControl('', Validators.required),
        contacto_telefono: new FormControl('', Validators.required),
        direccion: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        razon_social: new FormControl('', Validators.required),
        telefono: new FormControl('', Validators.required),
        nit: new FormControl('', Validators.required),
        usuario_id: new FormControl('', Validators.required),
        ciudad_id: new FormControl('', Validators.required),
        tipo_contribuyente: new FormControl('', Validators.required),
        id: new FormControl('', Validators.required)
    });
    changeDetector: any;

    ///////// Forms Groups ////////////
    constructor(private hotelsService:HotelsService, private spinner: NgxSpinnerService, private confirmationService: ConfirmationService, private toastModule: ToastModule, private dialogModule: DialogModule , private messageService: MessageService, private usersService: UsersService, private breadcrumbService: BreadcrumbService, private tableModule: TableModule, private buttonModule: ButtonModule, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        /// Datos de Usuario
        this.dataUser = this.getCurrentUser();
        console.log(this.dataUser.usuario.id);
        // Inicializamos la consulta de hoteles
        this.getIndex();
        this.hotelsService.data.subscribe(hotels => {
            this.hotels = hotels;
            this.changeDetector.detectChanges();
        });
        //// Consultar Paises
        this.hotelsService.getCountries(10).subscribe(response => {
            this.countries$ = response;
        });
        //// Consultar Estados
        this.hotelsService.getStates(12).subscribe( response =>{
            this.states$ = response;
            console.log(this.states$);
        }, error =>{
            console.log('Error:', error);
        });
        //// Consultar CIudades
        this.hotelsService.getCities(13).subscribe( response =>{
            this.cities$ = response;
            console.log(this.cities$);
        }, error => {
            console.log('Error:', error);
        })
    }
    ///// Datos de Usuario /////
    getCurrentUser(): any {
        const currentUser = localStorage.getItem('currentUser');

        if (currentUser) {
            return JSON.parse(currentUser);
        }

        return null;
    }
    /////// Consultar Todos los Hoteles  ///////////
    getIndex(search: string = '', pageCount: number = this.pageCount, page: number = 1): void {
        this.spinner.show();
        this.loadingTable = true;
        this.hotelsService.getHotels(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.hotels = response.data;
                this.totalHotels = response.total;
                console.log(this.hotels);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }
    ////////////  CREAR UN NUEVO HOTEL  /////////////
    createHotel(){
        this.formNewHotel.reset();
        this.formNewHotel.get('ciudad_id').setValue(this.selectedCity.id);
        this.formNewHotel.get('usuario_id').setValue(this.dataUser.usuario.id);
        this.formNewHotel.get('tipo_contribuyente').setValue(this.tcontribuyente);
        const datos = this.formNewHotel.value;
        this.hotelsService.createHotel(datos).subscribe(response => {
            console.log(response);
            this.hotelsService.refresHotelsData();
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Hotel creado.',sticky: true, life: 200, });
            this.crearH = false;
        }, error => {
        console.log('Error:', error);
        });
    }
    /////////// Consultar 1 hotel  //////////////
    getHotel(id:number){
        this.hotelsService.getHotelById(id).subscribe(response => {
            this.hotelData = response.hotel;
            this.hotelData.id = id;
            this.editarH = true;
            this.formEditHotel.get('nombre').setValue(this.hotelData.nombre);
            this.formEditHotel.get('email').setValue(this.hotelData.email);
            this.formEditHotel.get('cantidad_habitaciones').setValue(this.hotelData.cantidad_habitaciones);
            this.formEditHotel.get('direccion').setValue(this.hotelData.direccion);
            this.formEditHotel.get('telefono').setValue(this.hotelData.telefono);
            this.formEditHotel.get('contacto').setValue(this.hotelData.contacto);
            this.formEditHotel.get('contacto_cargo').setValue(this.hotelData.contacto_cargo);
            this.formEditHotel.get('razon_social').setValue(this.hotelData.razon_social);
            this.formEditHotel.get('contacto_telefono').setValue(this.hotelData.contacto_telefono);
            this.formEditHotel.get('nit').setValue(this.hotelData.nit);

        })
    }

    /////////// Editar Hotel //////////////
    updateHotel(){
        this.formEditHotel.get('id').setValue(this.hotelData.id);
        this.formEditHotel.get('ciudad_id').setValue(this.hotelData.ciudad_id);
        this.formEditHotel.get('tipo_contribuyente').setValue(this.hotelData.tipo_contribuyente);
        this.formEditHotel.get('usuario_id').setValue(this.hotelData.usuario_id);
        const datos = this.formEditHotel.value;
        this.hotelsService.updateHotel(datos).subscribe( response => {
            //Cierra el modal de edición
            console.log(response);
            this.editarH = false;
            this.messageService.add({ severity: 'info', summary: 'Confirmación Exitosa', detail: 'Usuario actualizado.',sticky: true, life: 200, });
             //Actualiza la tabla de usuarios con el nuevo registro
            this.hotelsService.refresHotelsData();
            //Actualiza la tabla de usuarios con el nuevo registro
        }, error =>{
            console.log('Error:', error)
        });
    }
    confirmDelete(id:number){
        console.log(id);
        Swal.fire({
            title: "¿Estas Seguro que deseas eliminar el hotel?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
                this.hotelsService.deleteHotel(id).subscribe( response =>{
                    console.log(response);
                    this.hotelsService.refresHotelsData();
                });
                Swal.fire({
                title: "Confirmación",
                text: "El hotel ha sido eliminado.",
                icon: "success"
              });
            }
          });
    }

    getCountries() {
        this.hotelsService.getCountries(10).subscribe(response => {
           this.countries$ = response;

        });
       }
       getStates() {
        this.hotelsService.getStates(this.selectedCountry).subscribe(response => {
            this.states$ = response;
        });
    }
    getCities() {
        this.hotelsService.getCities(this.selectedState).subscribe(response => {
            this.cities$ = response;
        });
    }

    modalNewHotel(){
        this.crearH = true;
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
