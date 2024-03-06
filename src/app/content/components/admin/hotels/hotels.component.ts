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
    public imagen: any = null;

    //Variables para Paginador y Buscador
    public pageCount: number = 10;
    public pageActual: number = 1;
    public ultimaPage: number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;
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
        direccion: new FormControl('', Validators.required),
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
        email: new FormControl('', Validators.required),
        imagen: new FormControl('', Validators.required) // Agrega un nuevo campo para la imagen
     });

     formEditHotel = new FormGroup({
        nombre: new FormControl('', Validators.required),
        cantidad_habitaciones: new FormControl('', Validators.required),
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
        // Inicializamos la consulta de hoteles
        this.getIndex();

        // Consultar Paises
        this.hotelsService.getCountries().subscribe(response => {
            this.countries$ = response;
        });

        // Consultar Estados
        this.hotelsService.getStates(12).subscribe(response =>{
            this.states$ = response;
        }, error =>{
            console.log('Error:', error);
        });

        // Consultar CIudades
        this.hotelsService.getCities(13).subscribe( response =>{
            this.cities$ = response;
        }, error => {
            console.log('Error:', error);
        });
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
        this.hotelsService.getAll(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.hotels = response.data;
                this.totalHotels = response.total;
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

    //Carga imagenes
    onRemove(event){
        this.imagen = null;
    }

    onSelect(event) {
        this.imagen = event.currentFiles[0];
    }

    ////////////  CREAR UN NUEVO HOTEL  /////////////
    modalNewHotel() {
        this.crearH = true;
    }

    createHotel() {
        this.formNewHotel.get('ciudad_id').setValue(this.selectedCity ? this.selectedCity.id : null);
        this.formNewHotel.get('usuario_id').setValue(this.dataUser.usuario.id);
        this.formNewHotel.get('tipo_contribuyente').setValue(this.tcontribuyente);
        const datos = this.formNewHotel.value;

        // Convertir la imagen a una representación de cadena de caracteres JSON
        const imagenJson = JSON.stringify(this.imagen);

        // Asignar la representación JSON de la imagen al campo de imagen del formulario
        this.formNewHotel.get('imagen').setValue(imagenJson);

        this.hotelsService.createHotel(datos).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.crearH = false;
                if(response.code == "success"){
                    Swal.fire({
                        title: "Exito",
                        text: "Hotel creado exitosamente.",
                        icon: "success"
                    });
                    this.getIndex();
                    this.formNewHotel.reset();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Error al crear el hotel." ,
                        icon: "error"
                    });
                }
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }


    getHotel(id: number) {
        this.hotelsService.getHotel(id).subscribe(response => {
            this.hotelData = response.hotel;
            this.hotelData.id = id;
            this.editarH = true;
            this.formEditHotel.patchValue({
                nombre: this.hotelData.nombre,
                email: this.hotelData.email,
                cantidad_habitaciones: this.hotelData.cantidad_habitaciones,
                direccion: this.hotelData.direccion,
                telefono: this.hotelData.telefono,
                contacto: this.hotelData.contacto,
                contacto_cargo: this.hotelData.contacto_cargo,
                contacto_telefono: this.hotelData.contacto_telefono,
                razon_social: this.hotelData.razon_social,
                nit: this.hotelData.nit,
                id: this.hotelData.id,
                ciudad_id: this.hotelData.ciudad_id,
                tipo_contribuyente: this.hotelData.tipo_contribuyente,
                usuario_id: this.hotelData.usuario_id
            });
        });
    }

    /////////// Editar Hotel //////////////
    updateHotel(){
        this.formEditHotel.get('id').setValue(this.hotelData.id);
        this.formEditHotel.get('ciudad_id').setValue(this.hotelData.ciudad_id);
        this.formEditHotel.get('tipo_contribuyente').setValue(this.hotelData.tipo_contribuyente);
        this.formEditHotel.get('usuario_id').setValue(this.hotelData.usuario_id);
        const datos = this.formEditHotel.value;
        this.hotelsService.updateHotel(datos).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.editarH = false;
                if(response.code == "success"){
                    Swal.fire({
                        title: "Exito",
                        text: "Producto creado exitosamente.",
                        icon: "success"
                    });
                    this.getIndex();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Error al crear el producto." ,
                        icon: "error"
                    });
                }
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    confirmDelete(id:number){
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
                    this.hotelsService.refreshHotelsData();
                });
                Swal.fire({
                    title: "Confirmación",
                    text: "El hotel ha sido eliminado.",
                    icon: "success"
                });
                this.getIndex();
            }
        });
    }

    getCountries() {
        this.hotelsService.getCountries().subscribe(response => {
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
