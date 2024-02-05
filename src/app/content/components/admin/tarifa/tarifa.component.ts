import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToggleButton } from 'primeng/togglebutton';
import { RoomsService } from 'src/app/content/service/rooms/rooms.service';
import { TarifaService } from 'src/app/content/service/tarifa/tarifa.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-tarifa',
    templateUrl: './tarifa.component.html',
    styleUrls: ['./tarifa.component.scss']
})
export class TarifaComponent {

@ViewChild('toggleButtonEdit', { static: true }) toggleButtonEdit: ToggleButton;

public loadingTable: boolean = false;
public roomsData: any[];
public pageCount: number = 10;
public imagen: any = null;
public countRegisters: number;
public formSearch: FormGroup;
public formCreateTarifa: FormGroup;
public formEditTarifa: FormGroup;
public visibleModalTarifa: boolean = true;
public visibleModalRoomsEditar: boolean = false;
public idEditando: number = 0;
public dataEditarInfoRooms: any;
public hotel: any[];
public nombre: string;
public descripcion: string;
public tipo: any[];
public pisos: any[];
public capacidadPersonas: number;
public precio: number;
public diseno_json: any[];
public first:number = 0;
public rows:number = 8;
public pageActual:number = 1;
public ultimaPage:number = 1;
public disablePageLeft: boolean = false;
public disablePageRight: boolean = false;
public disableTipoCrear: number = 2;

constructor(
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private tarifaService: TarifaService
) {}

ngOnInit(): void {
    this.buildForm();
    this.getIndex();
    this.visibleModalTarifa = false;
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

openModal() {
    this.onCreate();
}

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

//Crear

onCreate() {
    this.formCreateTarifa.reset();
    console.log('onCreate se está ejecutando');
    this.tarifaService.getTarifas(0).subscribe(
        (response: any) => {
        this.hotel = response.hotel;
        
        this.tipo = response.tipo_habitacion;
        this.visibleModalTarifa = true;
        },
        (error) => {
        console.error('Error en getTarifas:', error);
        }
    );
}

newTarifa() {
    this.spinner.show();
    let data = this.formCreateTarifa.value;

    data.hotel_id = data.hotel_id['id']; 
    data.tipo_habitacion_id = data.tipo_habitacion['id']; 
    data.tipo = this.disableTipoCrear; 

    console.log(data)

    this.tarifaService.create(data).subscribe(
        (response: any) => {
            this.spinner.hide();
            this.imagen = null;
            this.visibleModalTarifa = false;
            if (response.code == 'success') {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Tarifa creada exitosamente.',
                    icon: 'success',
                });

                this.getIndex();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al crear la tarifa.',
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
    if (this.formCreateTarifa.valid) {
        this.newTarifa();
    } else {
        this.formCreateTarifa.markAllAsTouched();
    }
}

  //Editar

editRooms(id: number) {
    this.idEditando = id;
    this.spinner.show();
    this.tarifaService.getTarifas(id).subscribe(
        (response: any) => {
            console.log(response)
            this.spinner.hide();
            this.hotel = response.hotel; 
            this.tipo = response.tipo_habitacion;

            this.formEditTarifa.setValue({
                hotel_id: this.hotel.find(hotel => hotel.id == response.tarifa.hotel_id),
                tipo_habitacion: this.tipo.find(tipo => tipo.id == response.tarifa.tipo_habitacion_id),
                tipo:1,
                nombre: response.tarifa.nombre,
                cantidad: response.tarifa.cantidad,
                valor: response.tarifa.valor,
                descripcion: response.tarifa.descripcion,
            });

            if(this.toggleButtonEdit){
    
            if(response.tarifa.tipo==2){
                if(this.toggleButtonEdit.checked){
                    const dummyEvent = new MouseEvent('click'); // Crear un evento de clic simulado
                    this.toggleButtonEdit.toggle(dummyEvent);
                } 
            }

                if(response.tarifa.tipo==1){ 
                    if(!this.toggleButtonEdit.checked){
                        const dummyEvent = new MouseEvent('click'); // Crear un evento de clic simulado
                        this.toggleButtonEdit.toggle(dummyEvent);
                    }  
                } 
            }

            setTimeout(() => {
                this.visibleModalRoomsEditar = true;
            }, 1);
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
}

updateRoom() {
    this.spinner.show();
    let data = this.formEditTarifa.value;
    data.hotel_id = data.hotel_id['id']; 
    data.tipo_habitacion_id = data.tipo_habitacion['id']; 
    data.tipo = this.toggleButtonEdit.checked?1:2; 
    data.id = this.idEditando; 

    this.tarifaService.update(data).subscribe(
        (response: any) => {
            this.spinner.hide();
            this.imagen = null;
            this.visibleModalRoomsEditar = false;
            if (response.code == 'success') {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Tarifa actualizada exitosamente.',
                    icon: 'success',
                });

                this.getIndex();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar la tarifa.',
                    icon: 'error',
                });
            }
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
}

submitUpdate() {
    if (this.formEditTarifa.valid) {
        this.updateRoom();
    }
}

//Eliminar

confirmDelete(id:number){
    Swal.fire({
        title: "¿Estas seguro que deseas eliminar esta tarifa?",
        text: "Ten cuidado esta acción no se prodrá reversar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Confirmar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            this.spinner.show();
            this.tarifaService.delete({id}).subscribe(
            (response: any) => {
                this.spinner.hide();
                if(response.code == "success"){

                Swal.fire({
                    title: "Exito",
                    text: "Habitación eliminada exitosamente.",
                    icon: "success"
                });

                this.getIndex();

                }  else {

                Swal.fire({
                    title: "Error",
                    text: "Error al eliminar la habitación." ,
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

//Construcción formulario

buildForm() {
    this.formSearch = this.FB.group({
        search: ['', []],
    });

    this.formCreateTarifa = this.FB.group({
        hotel_id: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        tipo: ['', []], 
        valor: ['', [Validators.required]], 
        cantidad: ['', [Validators.required]], 
        tipo_habitacion: [''], 
    });

    this.formEditTarifa = this.FB.group({
        hotel_id: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        tipo: ['', []], 
        valor: ['', [Validators.required]], 
        cantidad: ['', [Validators.required]], 
        tipo_habitacion: [''], 
    });
}

getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1) {
    this.spinner.show();
    this.loadingTable = true;
    this.tarifaService.getAll(pageCount, search, page).subscribe(
        (response: any) => {
            this.loadingTable = false;
            this.roomsData = response.data;
            this.countRegisters = response.total;
            this.ultimaPage = response.last_page;

            if(response.total>pageCount){
                this.disablePageRight = true;
            }
            this.validatePage();
            this.spinner.hide();
        },
        (error) => {
            console.log('Error: ', error);
            this.spinner.hide();
        }
    );
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

onToggleCreateChange($event){ 

    if(!$event.checked){
        this.disableTipoCrear = 2;
    } else {
        this.disableTipoCrear = 1;
    }
}

}
