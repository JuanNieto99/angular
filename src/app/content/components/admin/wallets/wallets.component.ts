import { Component } from '@angular/core';
import { WalletService } from 'src/app/content/service/admin/wallet.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { tipo } from '../../dashboard/products/products.component';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}


@Component({
    selector: 'app-permisssions',
    templateUrl: './wallets.component.html'
})
export class WalletsComponent {

    public loadingTable: boolean = false;
    public walletData: any[];
    public formCreateWallet: FormGroup;
    public formEditWallet: FormGroup;
    public visibleModalWallet: boolean = false;
    public visibleModalWalletEditar: boolean = false;
    public hotel: any[];
    public nombre: string;
    public descripcion: string;
    public base: number;
    public tipoCaja: any[];
    public usuarios: any[];
    public idEditando: number = 0;

    //Buscador

    public formSearch: FormGroup;


    //Paginador variables
    public pageCount: number = 10;
    public pageActual:number = 1;
    public ultimaPage:number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;
    public first:number = 0;
    public rows:number = 8;
    public countRegisters: number;

    constructor(
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private WalletService: WalletService
    ) {}

    ngOnInit(): void {
        this.buildForm();
        this.getIndex();
        this.visibleModalWallet = false;
    }

    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1) {
        this.spinner.show();
        this.loadingTable = true;
        this.WalletService.getAll(pageCount, search, page).subscribe(
            (response: any) => {
                this.loadingTable = false;
                this.walletData = response.data;
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

    buildForm() {
        this.formSearch = this.FB.group({
            search: ['', []],
        });

        this.formCreateWallet = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombre: ['', [Validators.required]],
            descripcion: ['', [Validators.required]],
            base: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            usuario_id: ['', [Validators.required]] // Aquí se define el control usuario_id
        });

        this.formEditWallet = this.FB.group({
            hotel_id: ['', [Validators.required]],
            nombre: ['', [Validators.required]], // Asegúrate de que este control esté definido
            descripcion: ['', [Validators.required]],
            base: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            usuario_id: ['', [Validators.required]]
        });
    }

    //Crear

    openModal() {
        this.onCreate();
    }

    onCreate() {
        this.formCreateWallet.reset();
        this.WalletService.getWallet(0).subscribe(
            (response: any) => {
                this.hotel = response.hotel;
                this.nombre = response.nombre;
                this.descripcion = response.descripcion;
                this.base = response.base;
                this.tipoCaja = response.tipo_caja; // Asignar los datos de tipo de caja
                this.usuarios = response.usuario; // Asignar los datos de usuario
                this.visibleModalWallet = true;
                console.log('Consulta create'+response)
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }


    submitCreate() {
        if (this.formCreateWallet.valid) {
            this.newWallet();
        } else {
            this.formCreateWallet.markAllAsTouched();
        }
    }

    newWallet() {
        this.visibleModalWallet = true;
        this.spinner.show();
        let dataWallet = this.formCreateWallet.value;

            dataWallet.hotel_id = dataWallet.hotel_id['id'];
            dataWallet.usuario_id = dataWallet.usuario_id['id'];
            dataWallet.tipo = dataWallet.tipo['id'];
            dataWallet.estado = 1;

            this.WalletService.createWallet(dataWallet).subscribe(
                (response: any) => {
                    this.spinner.hide();
                    this.visibleModalWallet = false;
                    if (response.code == 'success') {
                        Swal.fire({
                            title: 'Exito',
                            text: 'Caja creada exitosamente.',
                            icon: 'success',
                        });

                        this.getIndex();
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al crear la caja.',
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

    submitUpdate(){
        if(this.formEditWallet.valid){
          this.updateWallet();
        }
    }

    editWallet(id: number) {
        this.idEditando = id;
        this.spinner.show();
        this.WalletService.getWallet(id).subscribe(
            (response: any) => {
                console.log(response);
                this.spinner.hide();
                const caja = response.caja; // Acceder al objeto caja dentro de la respuesta
                this.hotel = response.hotel;
                this.nombre = caja.nombre;
                this.descripcion = caja.descripcion;
                this.base = caja.base;
                this.tipoCaja = response.tipo_caja; // Asignar directamente tipo_caja a this.tipoCaja
                this.usuarios = response.usuario; // Asignar directamente usuario a this.usuarios

                this.formEditWallet.setValue({
                    hotel_id: this.hotel,
                    tipo: this.tipoCaja,
                    nombre: this.nombre,
                    base: this.base,
                    usuario_id: caja.usuario_id, // Asignar usuario_id de la caja
                    descripcion: this.descripcion,
                });

                setTimeout(() => {
                    this.visibleModalWalletEditar = true;
                }, 1);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    updateWallet() {
        this.spinner.show();
        let dataWallet = this.formEditWallet.value;

        // Obtener solo los IDs de tipo y usuario_id
        dataWallet.tipo = dataWallet.tipo.id;
        dataWallet.usuario_id = dataWallet.usuario_id.id;

        dataWallet.hotel_id = dataWallet.hotel_id.id;
        dataWallet.id = this.idEditando;
        dataWallet.estado = 1;
        console.log(dataWallet);

        this.WalletService.updateWallet(dataWallet).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.visibleModalWalletEditar = false;
                if (response.code == 'success') {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Caja actualizada exitosamente.',
                        icon: 'success',
                    });

                    this.getIndex();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al actualizar la caja.',
                        icon: 'error',
                    });
                }
            },
            (error) => {
                console.log('Error: ', error);
            }
        );
    }

    //Eliminar

    confirmDelete(id:number){
        Swal.fire({
            title: "¿Estas seguro que deseas eliminar esta caja?",
            text: "Ten cuidado esta acción no se prodrá reversar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.WalletService.deleteWallet({id}).subscribe(
                (response: any) => {
                    this.spinner.hide();
                    if(response.code == "success"){

                    Swal.fire({
                        title: "Exito",
                        text: "Caja eliminada exitosamente.",
                        icon: "success"
                    });

                    this.getIndex();

                    }  else {

                    Swal.fire({
                        title: "Error",
                        text: "Error al eliminar la caja." ,
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

    onPage(event){
        this.pageCount = event['rows'];
        this.getIndex('', this.pageCount);
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
