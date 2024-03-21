import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InternalSequenceService } from 'src/app/content/service/internalSequence/internal-sequence.service';
import Swal from 'sweetalert2';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

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
    public pageActual:number = 1;
    public ultimaPage:number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;
    public first:number = 0;
    public rows:number = 8;
    public tipo_operacion: any;

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
                this.secuenciaInicial = response.secuencia_incial;
                this.secuenciaActual = response.secuencia_actual;
                this.tipo_operacion = response.tipo_operacion;
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
        dataInternalSequence.tipo_operacion_id = dataInternalSequence.tipo_operacion_id['id']; 
        dataInternalSequence.estado = 1;

        this.InternalSequenceService.createInternalSequence(dataInternalSequence).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.imagen = null;
                this.visibleModalInternalSequence = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Secuencia interna creada exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else if (response.code == 'warning'){
                    Swal.fire({
                        title: 'Advertencia',
                        text: response.mensaje ,
                        icon: 'warning',
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al crear la secuencia interna.',
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
                let hotel:any ;
                let tipoOperacion:any ;

                this.hotel = response.hotel;


                this.tipo_operacion = response.tipo_operacion;

                const secuenciaInterna = response.secuencia_interna;

                if (secuenciaInterna && 'descripcion_secuencia' in secuenciaInterna) {
                    this.secuenciaDescripcion = secuenciaInterna.descripcion_secuencia;
                    this.secuenciaInicial = secuenciaInterna.secuencia_incial;
                    this.secuenciaActual = secuenciaInterna.secuencia_actual;
                    let tipo_operacion_id = secuenciaInterna.tipo_operacion_id;

                    
                    response.hotel.forEach(element => {
                        if(element.id == secuenciaInterna.hotel_id){
                            hotel = element;
                        }
                    });

                                        
                    response.tipo_operacion.forEach(element => {
                        if(element.id == secuenciaInterna.tipo_operacion_id){
                            tipoOperacion = element;
                        }
                    });

                    this.formEditInternalSequence.setValue({
                        hotel_id: hotel,
                        descripcion_secuencia: this.secuenciaDescripcion,
                        secuencia_incial: this.secuenciaInicial,
                        secuencia_actual: this.secuenciaActual,
                        tipo_operacion_id: tipoOperacion,
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
        dataInternalSequence.tipo_operacion_id = dataInternalSequence.tipo_operacion_id.id;
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
                        text: 'Secuencia intera actualizada exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar la secuencia interna.',
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
            tipo_operacion_id: ['', [Validators.required]],
            descripcion_secuencia: ['', [Validators.required]],
            secuencia_incial: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            secuencia_actual: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]

        });

        this.formEditInternalSequence = this.FB.group({
            hotel_id: ['', [Validators.required]],
            tipo_operacion_id: ['', [Validators.required]],
            descripcion_secuencia: ['', [Validators.required]],
            secuencia_incial: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            secuencia_actual: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
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

    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1) {
        this.spinner.show();
        this.loadingTable = true;
        this.InternalSequenceService.getAll(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                console.log('Response: ', response);
                this.internalSequenceData = response.data;
                this.ultimaPage = response.last_page;
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


}
