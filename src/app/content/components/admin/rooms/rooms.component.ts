import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoomsService } from 'src/app/content/service/rooms/rooms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {
    public loadingTable: boolean = false;
    public roomsData: any[];
    public pageCount: number = 10;
    public imagen: any = null;
    public countRegisters: number;
    public formSearch: FormGroup;
    public formCreateRooms: FormGroup;
    public formEditRooms: FormGroup;
    public visibleModalRooms: boolean = true;
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

    constructor(
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private RoomsService: RoomsService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalRooms = false;
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

    //Crear

    onCreate() {
        this.formCreateRooms.reset();
        console.log('onCreate se está ejecutando');
        this.RoomsService.getRooms(0).subscribe(
            (response: any) => {
              this.hotel = response.hotel;
              this.pisos = response.pisos;
              this.tipo = response.tipo_habitacion;
              this.visibleModalRooms = true;
            },
            (error) => {
              console.error('Error en getRooms:', error);
            }
          );
    }

    newRooms() {
        this.spinner.show();
        let dataRooms = this.formCreateRooms.value;

        console.log(dataRooms)

        dataRooms.hotel_id = dataRooms.hotel_id['id'];
        dataRooms.piso = dataRooms.pisos;
        dataRooms.tipo = dataRooms.tipo['id'];
        dataRooms.estado = 1;

        this.RoomsService.createRooms(dataRooms).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalRooms = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Habitación creada exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear la habitación.',
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
        if (this.formCreateRooms.valid) {
            this.newRooms();
        } else {
            this.formCreateRooms.markAllAsTouched();
        }
    }

    //Editar

    editRooms(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.RoomsService.getRooms(id).subscribe(
            (response: any) => {
                console.log(response)
                this.spinner.hide();
                this.hotel = response.hotel;
                this.nombre = response.habitacion.nombre;
                this.tipo = response.tipo_habitacion;
                this.pisos = response.pisos;

                this.formEditRooms.setValue({
                    hotel_id: this.hotel,
                    pisos: this.pisos.find(piso => piso == response.habitacion.piso),
                    tipo: this.tipo.find(tipo => tipo.id == response.habitacion.tipo),
                    nombre: this.nombre,
                    capacidad_personas: response.habitacion.capacidad_personas,
                    precio: response.habitacion.precio,
                    descripcion: response.habitacion.descripcion,
                    diseno_json: response.habitacion.diseno_json
                });

                console.log();
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
        let dataRooms = this.formEditRooms.value;
        dataRooms.hotel_id = dataRooms.hotel_id.id;
        dataRooms.tipo = dataRooms.tipo.id;
        dataRooms.piso = dataRooms.pisos;
        dataRooms.id = this.idEditando;
        dataRooms.estado = 1;
        console.log(dataRooms);

        this.RoomsService.updateRooms(dataRooms).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalRoomsEditar = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Producto actualizado exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar el producto.',
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
        if (this.formEditRooms.valid) {
            this.updateRoom();
        }
    }

    //Eliminar

    confirmDelete(id:number){
        Swal.fire({
          title: "¿Estas seguro que deseas eliminar esta habitación?",
          text: "Ten cuidado esta acción no se prodrá reversar",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Confirmar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.RoomsService.deleteRooms({id}).subscribe(
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

        this.formCreateRooms = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            capacidad_personas: ['', [Validators.required]],
            precio: ['', [Validators.required]],
            pisos: [''],
            diseno_json: ['']
        });

        this.formEditRooms = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            capacidad_personas: ['', [Validators.required]],
            precio: ['', [Validators.required]],
            pisos: [''],
            diseno_json: ['']
        });
    }

    getIndex(search: string = '', page: number = this.pageCount) {
        this.spinner.show();
        this.loadingTable = true;
        this.RoomsService.getAll(page, search).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.roomsData = response.data;
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
