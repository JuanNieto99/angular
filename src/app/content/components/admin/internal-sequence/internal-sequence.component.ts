import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InternalSequenceService } from 'src/app/content/service/internalSequence/internal-sequence.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-internal-sequence',
  templateUrl: './internal-sequence.component.html',
  styleUrls: ['./internal-sequence.component.scss']
})
export class InternalSequenceComponent {
    public loadingTable: boolean = false;
    public internalSequenceData: any[];
    public pageCount: number = 10;
    public visibleModalInternalSequence: boolean = true;
    public visibleModalInternalSequenceEditar: boolean = false;
    public formCreateInternalSequence: FormGroup;
    public formSearch: FormGroup;
    public countRegisters: number;
    public formEditInternalSequence: FormGroup;
    public imagen: any = null;
    public hotel: any[];
    public idEditando: number = 0;
    public dataEditarInfoInternalSequence: any;
    public secuenciaDescripcion: any[];
    public secuenciaInicial: any[];
    public secuenciaActual: any[];

    constructor(
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private InternalSequenceService: InternalSequenceService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalInternalSequence = false;
    }

    openModal() {
        this.onCreate();
    }

    onCreate() {
        this.formCreateInternalSequence.reset();
        this.InternalSequenceService.getInternalSequence(0).subscribe(
            (response: any) => {
                this.hotel = response.hotel;
                this.secuenciaDescripcion = response.descripcion_secuencia;
                this.secuenciaInicial = response.secuensia_incial;
                this.secuenciaActual = response.secuensia_actual;
                this.visibleModalInternalSequence = true;
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

    //Create
    submitCreate() {
        if (this.formCreateInternalSequence.valid) {
            this.newInternalSequence();
        } else {
            this.formCreateInternalSequence.markAllAsTouched();
        }
    }

    newInternalSequence() {
        this.visibleModalInternalSequence = true;
        this.spinner.show();
        let dataInternalSequence = this.formCreateInternalSequence.value;

        dataInternalSequence.hotel_id = dataInternalSequence.hotel_id['id'];
        dataInternalSequence.estado = 1;

        this.InternalSequenceService.createInternalSequence(dataInternalSequence).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalInternalSequence = false;
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
    editInternalSequence(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.InternalSequenceService.getInternalSequence(id).subscribe(
            (response: any) => {
                console.log(response)
                this.spinner.hide();
                this.hotel = response.hotel;
                const secuenciaInterna = response.secuencia_interna;

                if (secuenciaInterna && 'descripcion_secuencia' in secuenciaInterna) {
                    this.secuenciaDescripcion = secuenciaInterna.descripcion_secuencia;
                    this.secuenciaInicial = secuenciaInterna.secuensia_incial;
                    this.secuenciaActual = secuenciaInterna.secuensia_actual;

                    this.formEditInternalSequence.setValue({
                        hotel_id: this.hotel,
                        descripcion_secuencia: this.secuenciaDescripcion,
                        secuensia_incial: this.secuenciaInicial,
                        secuencia_actual: this.secuenciaActual,
                    });
                }

                console.log();
                setTimeout(() => {
                    this.visibleModalInternalSequenceEditar = true;
                }, 1);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    updateInternalSequence() {
        this.spinner.show();
        let dataInternalSequence = this.formEditInternalSequence.value;
        dataInternalSequence.hotel_id = dataInternalSequence.hotel_id.id;
        dataInternalSequence.id = this.idEditando;
        dataInternalSequence.estado = 1;
        console.log(dataInternalSequence);

        this.InternalSequenceService.updateInternalSequence(dataInternalSequence).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalInternalSequenceEditar = false;
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
        if (this.formEditInternalSequence.valid) {
            this.updateInternalSequence();
        }
    }


    buildForm() {
        this.formSearch = this.FB.group({
            search: ['', []],
        });

        this.formCreateInternalSequence = this.FB.group({
            hotel_id: ['', [Validators.required]],
            descripcion_secuencia: ['', [Validators.required]],
            secuensia_incial: ['', [Validators.required]],
            secuensia_actual: ['', [Validators.required]]

        });
        
        this.formEditInternalSequence = this.FB.group({
            hotel_id: ['', [Validators.required]],
            descripcion_secuencia: ['', [Validators.required]],
            secuensia_incial: ['', [Validators.required]],
            secuencia_actual: ['', [Validators.required]]
        });
    }

    //Eliminar

    confirmDelete(id:number){
        Swal.fire({
          title: "¿Estas seguro que deseas eliminar esta secuencia?",
          text: "Ten cuidado esta acción no se prodrá reversar",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Confirmar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.InternalSequenceService.deleteInternalSequence({id}).subscribe(
                (response: any) => {
                    this.spinner.hide();
                    if(response.code == "success"){

                    Swal.fire({
                        title: "Exito",
                        text: "Secuencia eliminada exitosamente.",
                        icon: "success"
                    });

                    this.getIndex();

                    }  else {

                    Swal.fire({
                        title: "Error",
                        text: "Error al eliminar la secuencia." ,
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

    getIndex(search: string = '', page: number = this.pageCount) {
        this.spinner.show();
        this.loadingTable = true;
        this.InternalSequenceService.getAll(page, search).subscribe(
            (response: any) => {
                this.loadingTable = false;
                console.log('Response: ', response);
                this.internalSequenceData = response.data;
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
