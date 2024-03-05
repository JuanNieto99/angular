import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { typeRoom } from 'src/app/content/models/dashboard/typeRoom.model';
import { TypeRoomsService } from 'src/app/content/service/typeRooms/type-rooms.service';
import Swal from 'sweetalert2';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-type-rooms',
    templateUrl: './type-rooms.component.html',
    styleUrls: ['./type-rooms.component.scss'],
})
export class TypeRoomsComponent {
    public typeRoomData: any[];
    public loadingTable: boolean = false;
    public pageCount: number = 10;
    public visibleModalTypeRoom: boolean = true;
    public formCreateTypeRoom: FormGroup;
    public formSearch: FormGroup;
    public formEditTypeRoom: FormGroup;
    public hotel: any[];
    public imagen: any = null;
    public countRegisters: number;
    public visibleModalTypeRoomEditar: boolean = false;
    public idEditando: number = 0;
    public dataEditarInfoTypeRoom: any;
    public first:number = 0;
    public rows:number = 8;
    public pageActual:number = 1;
    public ultimaPage:number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = true;
    public valPuerta: string = '';

    constructor(
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private typeRoomService: TypeRoomsService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalTypeRoom = false;
    }

    buildForm() {
        this.formSearch = this.FB.group({
            search: ['', []],
        });

        this.formCreateTypeRoom = this.FB.group({
            nombre: ['', [Validators.required]],
            hotel_id: ['', [Validators.required]],
        });

        this.formEditTypeRoom = this.FB.group({
            nombre: ['', [Validators.required]],
            hotel_id: ['', [Validators.required]],
        });
    }

    openModal() {
        this.onCreate();
    }

    onCreate() {
        this.formCreateTypeRoom.reset();
        this.typeRoomService.getTypeRoom(0).subscribe(
            (response: any) => {
                this.hotel = response.hotel;
                this.visibleModalTypeRoom = true;
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
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

    submitCreate() {
        console.log (this.formCreateTypeRoom.valid)
        if (this.formCreateTypeRoom.valid) {
            this.newTypeRoom();
        } else {
            this.formCreateTypeRoom.markAllAsTouched();
        }
    }

    newTypeRoom() {
        this.visibleModalTypeRoom = true;
        this.spinner.show();

        let json = {
            puerta:this.valPuerta,
        }

        let dataTypeRoom = this.formCreateTypeRoom.value;
        dataTypeRoom.hotel_id = dataTypeRoom.hotel_id['id'];
        dataTypeRoom.estado = 1;

        dataTypeRoom.diseno_json = JSON.stringify(json);

        this.typeRoomService.createTypeRoom(dataTypeRoom).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalTypeRoom = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Tipo de habitación creado exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear el tipo de habitación.',
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
    editTypeRoom(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.typeRoomService.getTypeRoom(id).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.hotel = response.hotel;
                this.dataEditarInfoTypeRoom = response.typeRoom;
                this.formEditTypeRoom
                    .get('nombre')
                    .setValue(response.tiposHabitaciones.nombre);
                let hotel: any = null;
                this.valPuerta = (JSON.parse(response.tiposHabitaciones.diseno_json).puerta)
                //this.valPuerta =
                setTimeout(() => {
                    this.visibleModalTypeRoomEditar = true;
                }, 1);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    updateTypeRoom() {
        this.spinner.show();
        let dataTypeRoom = this.formEditTypeRoom.value;
        dataTypeRoom.hotel_id = dataTypeRoom.hotel_id['id'];
        dataTypeRoom.id = this.idEditando;
        dataTypeRoom.estado = 1;
        let json = {
            puerta:this.valPuerta,
        }

        dataTypeRoom.diseno_json = JSON.stringify(json);

        this.typeRoomService.updateTypeRoom(dataTypeRoom).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalTypeRoomEditar = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Tipo de habitación actualizada exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar el tipo de habitación.',
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
        if (this.formEditTypeRoom.valid) {
            this.updateTypeRoom();
        }
    }

    confirmDelete(id: number) {
        Swal.fire({
            title: '¿Estas seguro que deseas eliminar el tipo de habitación?',
            text: 'Ten cuidado esta acción no se prodrá reversar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.typeRoomService.deleteTypeRoom({ id }).subscribe(
                    (response: any) => {
                        this.spinner.hide();
                        if (response.code == 'success') {
                            Swal.fire({
                                title: 'Exito',
                                text: 'Tipo de habitación eliminada exitosamente.',
                                icon: 'success',
                            });

                            this.getIndex();
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'Error al eliminar el tipo de habitación.',
                                icon: 'error',
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

    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1) {
        this.spinner.show();
        this.loadingTable = true;
        this.typeRoomService.getAll(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.typeRoomData = response.data;
                this.countRegisters = response.total;
                this.spinner.hide();
            },
            (error) => {
                console.log('Error: ', error);
                this.spinner.hide();
            }
        );
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
