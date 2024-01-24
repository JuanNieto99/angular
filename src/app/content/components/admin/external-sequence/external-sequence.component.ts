import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExternalSequenceService } from '../../../service/externalSequence/external-sequence.service';
import Swal from 'sweetalert2';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-external-sequence',
    templateUrl: './external-sequence.component.html',
    styleUrls: ['./external-sequence.component.scss'],
})
export class ExternalSequenceComponent {
    public loadingTable: boolean = false;
    public externalSequenceData: any[];
    public pageCount: number = 10;
    public visibleModalExternalSequence: boolean = true;
    public visibleModalExternalSequenceEditar: boolean = false;
    public formCreateExternalSequence: FormGroup;
    public formSearch: FormGroup;
    public formEditExternalSequence: FormGroup;
    public countRegisters: number;
    public imagen: any = null;
    public hotel: any[];
    public idEditando: number = 0;
    public dataEditarInfoExternalSequence: any;
    public secuenciaInicial: number;
    public secuenciaActual: number;
    public secuenciaFinal: number;
    public fechaInicial: string;
    public fechaFinal: string;
    public prefijo: string;
    public pageActual: number = 1;
    public ultimaPage: number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = true;
    public first: number = 0;
    public rows: number = 8;

    constructor(
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private ExternalSequenceService: ExternalSequenceService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalExternalSequence = false;
    }

    openModal() {
        this.onCreate();
    }

    onCreate() {
        this.formCreateExternalSequence.reset();
        this.ExternalSequenceService.getExternalSequence(0).subscribe(
            (response: any) => {
                this.hotel = response.hotel;
                this.prefijo = response.prefijo;
                this.fechaInicial = response.fecha_inicio;
                this.fechaFinal = response.fecha_final;
                this.secuenciaInicial = response.secuensia_incial;
                this.secuenciaActual = response.secuensia_actual;
                this.secuenciaFinal = response.secuencia_final;
                this.visibleModalExternalSequence = true;
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
        if (this.formCreateExternalSequence.valid) {
            this.newExternalSequence();
        } else {
            this.formCreateExternalSequence.markAllAsTouched();
        }
    }

    newExternalSequence() {
        this.visibleModalExternalSequence = true;
        this.spinner.show();
        let dataExternalSequence = this.formCreateExternalSequence.value;

        dataExternalSequence.hotel_id = dataExternalSequence.hotel_id['id'];
        dataExternalSequence.estado = 1;

        this.ExternalSequenceService.createExternalSequence(
            dataExternalSequence
        ).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalExternalSequence = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Secuencia creada exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear la secuencia.',
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

    editExternalSequence(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.ExternalSequenceService.getExternalSequence(id).subscribe(
            (response: any) => {
                console.log(response);
                this.spinner.hide();
                this.hotel = response.hotel;
                const secuenciaExterna = response.secuencia_externa;

                if (secuenciaExterna && 'prefijo' in secuenciaExterna) {
                    // Formatear las fechas antes de asignarlas al formulario
                    this.secuenciaInicial = secuenciaExterna.secuensia_incial;
                    this.secuenciaActual = secuenciaExterna.secuensia_actual;
                    this.secuenciaFinal = secuenciaExterna.secuencia_final;
                    this.fechaInicial = new Date(secuenciaExterna.fecha_inicio)
                        .toISOString()
                        .split('T')[0];
                    this.fechaFinal = new Date(secuenciaExterna.fecha_final)
                        .toISOString()
                        .split('T')[0];
                    this.prefijo = secuenciaExterna.prefijo;

                    this.formEditExternalSequence.setValue({
                        hotel_id: this.hotel,
                        prefijo: this.prefijo,
                        fecha_inicio: this.fechaInicial,
                        fecha_final: this.fechaFinal,
                        secuensia_incial: this.secuenciaInicial,
                        secuensia_actual: this.secuenciaActual,
                        secuencia_final: this.secuenciaFinal,
                    });
                }

                setTimeout(() => {
                    this.visibleModalExternalSequenceEditar = true;
                }, 1);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    updateExternalSequence() {
        this.spinner.show();
        let dataExternalSequence = this.formEditExternalSequence.value;
        dataExternalSequence.hotel_id = dataExternalSequence.hotel_id.id;
        dataExternalSequence.id = this.idEditando;
        dataExternalSequence.estado = 1;

        this.ExternalSequenceService.updateExternalSequence(
            dataExternalSequence
        ).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalExternalSequenceEditar = false;
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
        if (this.formEditExternalSequence.valid) {
            this.updateExternalSequence();
        }
    }

    //Eliminar

    confirmDelete(id: number) {
        Swal.fire({
            title: '¿Estas seguro que deseas eliminar esta secuencia?',
            text: 'Ten cuidado esta acción no se prodrá reversar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.ExternalSequenceService.deleteExternalSequence({
                    id,
                }).subscribe(
                    (response: any) => {
                        this.spinner.hide();
                        if (response.code == 'success') {
                            Swal.fire({
                                title: 'Exito',
                                text: 'Secuencia eliminada exitosamente.',
                                icon: 'success',
                            });

                            this.getIndex();
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'Error al eliminar la secuencia.',
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

    buildForm() {
        this.formSearch = this.FB.group({
            search: ['', []],
        });

        this.formCreateExternalSequence = this.FB.group({
            hotel_id: ['', [Validators.required]],
            prefijo: ['', [Validators.required]],
            fecha_inicio: ['', [Validators.required]],
            fecha_final: ['', [Validators.required]],
            secuensia_incial: ['', [Validators.required]],
            secuensia_actual: ['', [Validators.required]],
            secuencia_final: ['', [Validators.required]],
        });

        this.formEditExternalSequence = this.FB.group({
            hotel_id: ['', [Validators.required]],
            prefijo: ['', [Validators.required]],
            fecha_inicio: ['', [Validators.required]],
            fecha_final: ['', [Validators.required]],
            secuensia_incial: ['', [Validators.required]],
            secuensia_actual: ['', [Validators.required]],
            secuencia_final: ['', [Validators.required]],
        });
    }

    getIndex(
        search: string = '',
        pageCount: number = this.pageCount,
        page: number = 1
    ) {
        this.spinner.show();
        this.loadingTable = true;
        this.ExternalSequenceService.getAll(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                console.log('Response: ', response);
                this.externalSequenceData = response.data;
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

    //Buscador

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
