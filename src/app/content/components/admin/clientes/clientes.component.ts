import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Clientes } from 'src/app/content/models/admin/clientes.model';
import { ClientesService } from 'src/app/content/service/clientes/clientes.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';


interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

    public clientesData: Clientes[];
    public loadingTable :boolean = false;
    public formCreateClientes: FormGroup;
    public formSearch: FormGroup;
    public formEditClientes: FormGroup;
    public visibleModalClientes: boolean = true;
    public visibleModalClientesEditar: boolean = false;
    public idEditando: number = 0;

    //Variables para localizacion
    public countries$: any[] = [];
    public states$: any[] = [];
    public cities$: any[] = [];
    public selectedCountry: any;
    public selectedState: any;
    public selectedCity: any;

    //Variables formularios
    public hotel: any[];
    public nombres: string;
    public apellidos: string;
    public celular: string;
    public telefono: string;
    public tipoDocumento: number;
    public numeroDocumento: string;
    public genero: number;
    public estadoCivil: number;
    public ciudad: number;
    public barrio: string;
    public fechaNacimiento: string;
    public nivelEstudio: number;
    public correo: string;
    public observacion: string;
    public tipo: number;

    //Paginador
    public pageCount: number = 10;
    public pageActual:number = 1;
    public ultimaPage:number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = true;
    public registrosContar: number = 0;
    public first:number = 0;
    public rows:number = 8;

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalClientes = false;

                // Consultar Paises
        this.clientesService.getCountries().subscribe(response => {
            this.countries$ = response;
        });

        // Consultar Estados
        this.clientesService.getStates(12).subscribe(response =>{
            this.states$ = response;
        }, error =>{
            console.log('Error:', error);
        });

        // Consultar CIudades
        this.clientesService.getCities(13).subscribe( response =>{
            this.cities$ = response;
        }, error => {
            console.log('Error:', error);
        });
    }

    constructor(
        private clientesService: ClientesService,
        private FB: FormBuilder,
        private spinner: NgxSpinnerService
    ){

    }

    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1){
        this.spinner.show();
        this.loadingTable = true;
        this.clientesService.getAll(pageCount, search, page).subscribe(
          (response: any) => {
              this.loadingTable = false;
              this.clientesData = response.data;
              this.ultimaPage = response.last_page;
              this.registrosContar = response.total;
              this.spinner.hide();
          },
          (error) => {
              console.log('Error: ', error);
          }
        );
    }

    buildForm(){
        console.log("Building form...");

        this.formSearch = this.FB.group({
            search: ['',[]],
        });

        this.formCreateClientes = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombres: ['', [Validators.required]],
            apellidos: ['', [Validators.required]],
            tipo_documento: ['', [Validators.required]],
            numero_documento: ['', [Validators.required]],
            genero: ['', [Validators.required]],
            estado_civil: ['', [Validators.required]],
            ciudad_id: ['', [Validators.required]], // Mantenemos 'ciudad_id' aquí
            barrio_residencia: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            celular: ['', [Validators.required]],
            fecha_nacimiento: ['', [Validators.required]],
            nivel_estudio: ['', [Validators.required]],
            tipo: ['',[Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            observacion: ['', [Validators.required]]
        });

        this.formEditClientes = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombres: ['', [Validators.required]],
            apellidos: ['', [Validators.required]],
            tipo_documento: ['', [Validators.required]],
            numero_documento: ['', [Validators.required]],
            genero: ['', [Validators.required]],
            estado_civil: ['', [Validators.required]],
            ciudad_id: ['', [Validators.required]], // Mantenemos 'ciudad_id' aquí
            barrio_residencia: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            celular: ['', [Validators.required]],
            fecha_nacimiento: ['', [Validators.required]],
            nivel_estudio: ['', [Validators.required]],
            tipo: ['',[Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            observacion: ['', [Validators.required]]
        });

    }


    //CREAR

    openModal(){
        this.onCreate();
    }

    onCreate() {
        this.formCreateClientes.reset();
        this.clientesService.getClientes(0).subscribe(
            (response: any) => {
                this.hotel = response.hotel;
                this.ciudad = response.ciudad_id;
                this.nombres = response.nombres;
                this.apellidos = response.apellidos;
                this.tipoDocumento = response.tipo_documento;
                this.numeroDocumento = response.numero_documento;
                this.genero = response.genero;
                this.estadoCivil = response.estado_civil;
                this.barrio = response.barrio_residencia;
                this.fechaNacimiento = response.fecha_nacimiento;
                this.nivelEstudio = response.nivel_estudio;
                this.correo = response.correo;
                this.tipo = response.tipo;
                this.observacion = response.observacion;
                this.visibleModalClientes = true;
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    submitCreate() {
        if (this.formCreateClientes.valid) {
            // Actualiza el valor de fecha_nacimiento en el formulario
            const fechaFinalFormatted = this.formatDate(this.formCreateClientes.get('fecha_nacimiento').value);
            this.formCreateClientes.get('fecha_nacimiento').setValue(fechaFinalFormatted);
            // Continúa con la creación del cliente
            this.newClientes();
            console.log('exito formulario submit crear');
        } else {
            this.formCreateClientes.markAllAsTouched();
            console.log('Formulario inválido');
        }
    }

    //Formate de fechas

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        // Obtiene los componentes de la fecha (año, mes, día, hora, minuto, segundo) en el huso horario local
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hour = ('0' + date.getHours()).slice(-2);
        const minute = ('0' + date.getMinutes()).slice(-2);
        const second = ('0' + date.getSeconds()).slice(-2);
        // Crea la cadena de fecha en el formato deseado (YYYY-MM-DD HH:MM:SS)
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }



    newClientes() {
        this.formCreateClientes.get('ciudad_id').setValue(this.selectedCity ? this.selectedCity.id : null);
        this.spinner.show();
        let dataClientes = this.formCreateClientes.value;

        dataClientes.hotel_id = dataClientes.hotel_id['id'];
        dataClientes.genero = dataClientes.genero['id'];
        dataClientes.estado_civil = dataClientes.estado_civil['id'];
        dataClientes.nivel_estudio = dataClientes.nivel_estudio['id'];
        dataClientes.ciudad_id = dataClientes.ciudad_id['id'];
        dataClientes.tipo_documento = dataClientes.tipo_documento['id'];
        dataClientes.tipo = dataClientes.tipo['id'];
        dataClientes.estado = 1;
        this.clientesService.createClientes(dataClientes).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.visibleModalClientes = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Cliente creado exitosamente.',
                        icon: 'success',
                    });
                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear el cliente.',
                        icon: 'error',
                    });
                }
            },
            (error) => {
                console.log('Error:', error);
                // Handle error here
            }
        );
    }

    //Editar

    editClientes(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.clientesService.getClientes(id).subscribe(
            (response: any) => {
                console.log(response);
                this.spinner.hide();
                this.hotel = response.hotel;
                this.estadoCivil = response.estado_civil;
                this.genero = response.genero;
                this.nivelEstudio = response.nivel_estudio;
                this.tipoDocumento = response.tipo_documento;
                this.tipo = response.tipo;
                const cliente = response.cliente;

                // this.estadoCivil = cliente.estado_civil;
                // this.genero = cliente.genero;
                // this.nivelEstudio = cliente.nivel_estudio;
                // this.tipoDocumento = cliente.tipoDocumento;
                // this.tipo = cliente.tipo;

                // Asignar los valores del cliente al formulario de edición
                this.formEditClientes.patchValue({
                    hotel_id: cliente.hotel,
                    nombres: cliente.nombres,
                    apellidos: cliente.apellidos,
                    tipo_documento: cliente.tipo_documento_id,
                    numero_documento: cliente.numero_documento,
                    genero: cliente.genero,
                    estado_civil: cliente.estado_civil_id,
                    ciudad_id: cliente.ciudad_id,
                    barrio_residencia: cliente.barrio_residencia,
                    telefono: cliente.telefono,
                    celular: cliente.celular,
                    fecha_nacimiento: new Date(cliente.fecha_nacimiento), // Convertir la cadena de fecha a objeto Date
                    nivel_estudio: cliente.nivel_studio_id,
                    tipo: cliente.tipo,
                    correo: cliente.correo,
                    observacion: cliente.observacion
                });

                // Mostrar el modal de edición
                setTimeout(() => {
                    this.visibleModalClientesEditar = true;
                }, 1);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    //Buscar localización
    getCountries() {
        this.clientesService.getCountries().subscribe(response => {
           this.countries$ = response;
        });
    }

    getStates() {
        this.clientesService.getStates(this.selectedCountry).subscribe(response => {
            this.states$ = response;
        });
    }

    getCities() {
        this.clientesService.getCities(this.selectedState).subscribe(response => {
            this.cities$ = response;
        });
    }

    //BUSCADOR

    searchInput(){
        let search = this.formSearch.get('search').value;
        if(search==""){
          this.getIndex(search);
        }
    }

    search(dt){
        let search = this.formSearch.get('search').value;
        this.getIndex(search);
    }

    onPage(event){
        this.pageCount = event['rows'];
        this.getIndex('', this.pageCount);
    }

    //Paginador

    onPageChange(event){
        this.first = event.first;
        this.rows = event.rows;
    }


    leftTable(){
        this.pageActual = this.pageActual - 1;
        this.getIndex('', this.pageCount, this.pageActual);
        this.validatePage();
    }

    rightTable(){
        this.pageActual = this.pageActual + 1;
        this.getIndex('', this.pageCount, this.pageActual);
        this.validatePage();
    }

    validatePage(){
        if(this.pageActual == 1 ){
            this.disablePageLeft = false;
        }

        if(this.pageActual > 1 ){
            this.disablePageLeft = true;
        }

        if(this.ultimaPage == this.pageActual){
            this.disablePageRight = false;
        }

        if(this.ultimaPage > this.pageActual){
            this.disablePageRight = true;
        }
    }


}
