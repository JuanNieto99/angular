import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { typeRoom } from 'src/app/content/models/dashboard/typeRoom.model';
import { TypeRoomsService } from 'src/app/content/service/typeRooms/type-rooms.service';
import Swal from 'sweetalert2';

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
        if (this.formCreateTypeRoom.valid) {
            this.newTypeRoom();
        } else {
            this.formCreateTypeRoom.markAllAsTouched();
        }
    }

    newTypeRoom() {
        this.visibleModalTypeRoom = true;
        this.spinner.show();
        let dataTypeRoom = this.formCreateTypeRoom.value;
        dataTypeRoom.hotel_id = dataTypeRoom.hotel_id['id'];
        dataTypeRoom.estado = 1;

        this.typeRoomService.createProduct(dataTypeRoom).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalTypeRoom = false;
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

                // this.hotel.forEach((value) => {
                //   if(value.id == this.dataEditarInfoTypeRoom.hotel_id){
                //     hotel = value;
                //   }
                // })

                console.log();
                setTimeout(() => {
                    //this.formEditTypeRoom.get('nombre').setValue(this.dataEditarInfoTypeRoom.nombre)
                    // this.formEditTypeRoom.get('hotel_id').setValue(hotel)

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

        this.typeRoomService.updateTypeRoom(dataTypeRoom).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalTypeRoomEditar = false;
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
                                text: 'tipo de habitación eliminada exitosamente.',
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

    getIndex(search: string = '', page: number = this.pageCount) {
        this.spinner.show();
        this.loadingTable = true;
        this.typeRoomService.getAll(page, search).subscribe(
            (response: any) => {
                this.loadingTable = false;
                console.log('Response: ', response);
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
}
