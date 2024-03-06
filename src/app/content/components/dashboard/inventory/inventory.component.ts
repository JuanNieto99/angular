import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Inventory } from 'src/app/content/models/dashboard/inventory.model';
import { InventoryService } from 'src/app/content/service/dashboard/inventory.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';


interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {

    public visibleModalInventory: boolean = true;
    public inventoryData: Inventory[];
    public loadingTable :boolean = false;
    public hotel: any[];
    public descripcion: string;
    public nombre: string;
    public visibleModalInventarioEditar:boolean = false;
    public idEditando: number = 0;

    // variables para formularios
    public formCreateInventory: FormGroup;
    public formSearch: FormGroup;
    public formEditInventory: FormGroup;

    //Variables paginador
    public pageCount: number = 10;
    public pageActual:number = 1;
    public ultimaPage:number = 1;
    public registrosContar: number = 0;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;
    public first:number = 0;
    public rows:number = 8;

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalInventory = false;
    }

    constructor(
        private InventoryService:InventoryService,
        private FB: FormBuilder,
        private spinner: NgxSpinnerService
    ){

    }

    onPage(event){
        this.pageCount = event['rows'];
        this.getIndex('', this.pageCount);
    }

    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1){
        this.spinner.show();
        this.loadingTable = true;
        this.InventoryService.getAll(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.inventoryData = response.data;
                this.ultimaPage = response.last_page;
                this.registrosContar = response.total;
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

    //CREAR

    openModal(){
        this.onCreate();
    }

    onCreate() {
        this.formCreateInventory.reset();
        this.InventoryService.getInventory(0).subscribe(
            (response: any) => {
                this.hotel = response.hotel;
                this.descripcion = response.descripcion;
                this.nombre = response.nombre;
                this.visibleModalInventory = true;
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    submitCreate(){
        //this.newProduct();
        if(this.formCreateInventory.valid){
          this.newInventory();
        } else {
          this.formCreateInventory.markAllAsTouched();
        }
    }

    newInventory() {
        this.visibleModalInventory = true;
        this.spinner.show();
        let dataInventory = this.formCreateInventory.value;

        dataInventory.hotel_id = dataInventory.hotel_id['id'];
        dataInventory.estado = 1;

        this.InventoryService.createInventory(dataInventory).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.visibleModalInventory = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Inventario creado exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear el inventario.',
                        icon: 'error',
                    });
                }
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    //Editar

    editInventory(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.InventoryService.getInventory(id).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.hotel = response.hotel;
                this.nombre = response.inventario.nombre;
                this.descripcion = response.inventario.descripcion;

                this.formEditInventory.setValue({
                    hotel_id: this.hotel,
                    nombre: this.nombre,
                    descripcion: this.descripcion,
                });

                setTimeout(() => {
                    this.visibleModalInventarioEditar = true;
                }, 1);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    updateInventory() {
        this.spinner.show();
        let dataInventory = this.formEditInventory.value;

        if (dataInventory.hotel_id) {
            dataInventory.hotel_id = dataInventory.hotel_id.id;
        }

        if (dataInventory.tipo) {
            dataInventory.tipo = dataInventory.tipo.id;
        }

        if (dataInventory.pisos) {
            dataInventory.piso = dataInventory.pisos;
        }

        dataInventory.id = this.idEditando;
        dataInventory.estado = 1;

        this.InventoryService.updateInventory(dataInventory).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.visibleModalInventarioEditar = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Inventario actualizado exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar el inventario.',
                        icon: 'error',
                    });
                }
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    submitUpdate(){
        if(this.formEditInventory.valid){
          this.updateInventory();
        }
    }

     //Eliminar

     confirmDelete(id:number){
        Swal.fire({
            title: "¿Estas seguro que deseas eliminar este inventario?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.InventoryService.deleteInventory({id}).subscribe(
                (response: any) => {
                    this.spinner.hide();
                    if(response.code == "success"){

                    Swal.fire({
                        title: "Exito",
                        text: "Inventario eliminada exitosamente.",
                        icon: "success"
                    });

                    this.getIndex();

                    }  else {

                    Swal.fire({
                        title: "Error",
                        text: "Error al eliminar el inventario." ,
                        icon: "error"
                    });

                    }

                },
                (error) => {
                    console.log('Error: ', error);
                }
                );
            }
        });
    }

    //Construccion del formulario

    buildForm(){

        this.formSearch = this.FB.group({
          search: ['',[]],
        });

        this.formCreateInventory = this.FB.group({
            nombre: ['',[Validators.required]],
            descripcion: ['',[Validators.required]],
            hotel_id: ['', [Validators.required]],
        });

        this.formEditInventory = this.FB.group({
            nombre: ['',[Validators.required]],
            descripcion: ['',[Validators.required]],
            hotel_id: ['', [Validators.required]],
        });

    }

    //Buscador

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
