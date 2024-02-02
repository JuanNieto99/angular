import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HotelsService } from 'src/app/content/service/admin/hotels.service';
import { CustomersService } from 'src/app/content/service/customers/customers.service'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent {
  public loadingTable: boolean = false;
  public pageCount: number = 10;
  public customersData: any[];
  public imagen: any = null;
  public hotel: any[];
  public observacion: any[];
  public nombres: string;
  public apellidos: string;
  public tipo_documento: string;
  public pais: any[];
  public departamentos: any[];
  public ciudads: any[];
  public selectedPais: any;
  public selectedDepartamento: any;
  public selectedCity: any;



  //Creación de formularios
  public visibleModalCustomers: boolean = true;
  public visibleModalCustomersEditar: boolean = false;
  public formSearch: FormGroup;
  public formCreateCustomers: FormGroup;
  public formEditCustomers: FormGroup;

  //Paginador y buscador
  public pageActual:number = 1;
  public ultimaPage:number = 1;
  public disablePageLeft: boolean = false;
  public disablePageRight: boolean = true;
  public first:number = 0;
  public rows:number = 8;
  public countRegisters: number;

  constructor(
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private CustomersService: CustomersService,
    private hotelsService:HotelsService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getIndex();
    this.visibleModalCustomers = false;
  }

  openModal() {
    this.onCreate();
  }

  onRemove(event) {
    this.imagen = null;
  }

  onSelect(event) {
      this.imagen = event.currentFiles[0]; //.objectURL.changingThisBreaksApplicationSecurity;
  }

  onPage(event) {
      this.pageCount = event['rows'];
      this.getIndex('', this.pageCount);
  }

  //CREAR

  onCreate() {
    this.formCreateCustomers.reset();
    this.CustomersService.getCustomers(0).subscribe(
        (response: any) => {
            console.log('Response de service customer: ', response);
            this.hotel = response.hotel;
            this.observacion = response.observacion;
            this.nombres = response.nombres;
            this.apellidos = response.apellidos;
            this.pais = response.pais;
            this.visibleModalCustomers = true;
            this.formCreateCustomers.get("pais").value;
            console.log('Este es el pais que se obtiene '+this.formCreateCustomers.get("pais").value);
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
  }

  onChangePais(event){
    console.log('Este es el evento '+event)
  }
  getStates(){
    this.hotelsService.getStates(this.selectedPais).subscribe(response => {
      this.departamentos = response;
    });
  };

  getCities() {
    this.hotelsService.getCities(this.selectedDepartamento).subscribe(response => {
      this.ciudads = response;
    });
  };

  newCustomers() {
    this.visibleModalCustomers = true;
    this.spinner.show();
    let dataCustomers = this.formCreateCustomers.value;

    dataCustomers.hotel_id = dataCustomers.hotel_id['id'];
    dataCustomers.estado = 1;

    this.CustomersService.createCustomers(dataCustomers).subscribe(
        (response: any) => {
            this.spinner.hide();
            this.imagen = null;
            this.visibleModalCustomers = false;
            if (response.code == 'success') {
                Swal.fire({
                    title: 'Exito',
                    text: 'Producto creado exitosamente.',
                    icon: 'success',
                });

                this.getIndex();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al crear el producto.',
                    icon: 'error',
                });
            }
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
  }

  submitCreate() {
    if (this.formCreateCustomers.valid) {
        this.newCustomers();
    } else {
        this.formCreateCustomers.markAllAsTouched();
    }
  }

  getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1) {
    this.spinner.show();
    this.loadingTable = true;
    this.CustomersService.getAll(pageCount, search, page).subscribe(
        (response: any) => {
            this.loadingTable = false;
            console.log('Response: ', response);
            this.customersData = response.data;
            this.ultimaPage = response.last_page;
            this.countRegisters = response.total;
            this.spinner.hide();
        },
        (error) => {
            console.log('Error: ', error);
            this.spinner.hide();
        }
    );
  }

  buildForm() {
    this.formSearch = this.FB.group({
        search: ['', []],
    });

    this.formCreateCustomers = this.FB.group({
        hotel_id: ['', [Validators.required]],
        nombres: ['', [Validators.required]],
        apellidos: ['',[Validators.required]],
        observacion: ['', [Validators.required]],
        pais_id: ['', [Validators.required]],
        departamentos_id: ['', [Validators.required]],
        ciudads_id: ['', [Validators.required]],
    });
    console.log(this.formCreateCustomers)

    this.formEditCustomers = this.FB.group({
      hotel_id: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['',[Validators.required]],
      observacion: ['', [Validators.required]],
      pais_id: ['', [Validators.required]],
      departamentos_id: ['', [Validators.required]],
      ciudads_id: ['', [Validators.required]],
    });
  }

  //Busqueda
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
