import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipesService } from '../../../../service/recipes/recipes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recipes-products',
  templateUrl: './recipes-products.component.html',
  styleUrls: ['./recipes-products.component.scss']
})
export class RecipesProductsComponent {

    public form: FormGroup;
    public formProducto: FormGroup;
    public productsData: any[] = [];
    public loadingTable: boolean = false;
    public dataRecipesDetail: any;
    public recetaId: number;
    public productoVisible: boolean = false;
    public productosSeleccionados: any[] = [];
    public displayModal: boolean = false;

    // Buscador y Paginador
    public pageCount: number = 10;
    public first: number = 0;
    public rows: number = 8;
    public pageActual: number = 1;
    public ultimaPage: number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;

    constructor(
        private recipesService: RecipesService,
        private FB: FormBuilder,
        private spinner: NgxSpinnerService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ){}

    ngOnInit(){
        this.spinner.hide();
        this.dataRecipesDetail = [];
        this.buildForm();
        this.recetaId = parseFloat(this.route.snapshot.paramMap.get('id'));
        console.log('ID de receta capturado:', this.recetaId);
        this.getProductsList(this.recetaId)
    }

    buildForm(){
        this.form = this.FB.group({
            nombreReceta: [this.dataRecipesDetail?.detalleRecipes?.recipes?.nombre, []],
            descripcion: [this.dataRecipesDetail?.detalleRecipes?.descripcion, []],
            precio: [this.dataRecipesDetail?.detalleRecipes?.precio, []],
            //hotel: [this.dataRecipesDetail?.detalleRecipes?.hotel, []],
        });

        this.formProducto  = this.FB.group({
            producto_id: [null, [Validators.required]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
        });
    }

    //Modal
    // Abre el modal
    openModal() {
        this.displayModal = true;
    }

    // Cierra el modal
    closeModal() {
        this.displayModal = false;
    }

    // Loading product

    getProductsList(id: number){
        this.loadingTable = true;
        this.recipesService.getProducts(id).subscribe(
            (response: any) => {
                this.productsData = response.productos;
                this.loadingTable = false;
            },
            (error) => {
                console.error(error);
                this.loadingTable = false;
            }
        );
    }

    // Método que se llama cuando el input de cantidad cambia
    onCantidadChange(event: any) {
        // Actualiza el valor del campo 'cantidad' en el formulario
        this.formProducto.controls['cantidad'].setValue(event.target.value);
    }

    // Select products

    agregarProductos() {
        // Obtiene los productos seleccionados del formulario
        const productosSeleccionadosId = this.formProducto.get('producto_id').value;
        const cantidad = this.formProducto.get('cantidad').value;

        // Verifica si el usuario ha seleccionado al menos un producto
        if (productosSeleccionadosId && productosSeleccionadosId.length > 0) {

            for (let producto of productosSeleccionadosId) {
                // Agrega la cantidad al objeto del producto
                producto.cantidad = cantidad;
                this.productosSeleccionados.push(producto);
            }

            this.cdr.detectChanges();

            // Resetea los campos 'producto_id' y 'cantidad' del formulario
            this.formProducto.get('producto_id').setValue(null);
            this.formProducto.get('cantidad').setValue(0);
            this.closeModal();
        } else {
            console.error('Por favor, selecciona al menos un producto antes de agregar.');
        }
    }

    //Agregar productos a recetas
    sendProducts() {
        // Verifica si hay productos seleccionados
        if (this.productosSeleccionados.length > 0) {
            let productos = this.productosSeleccionados.map(producto => {
                return {
                    producto_id: producto.id, // Asegúrate de que 'id' es la propiedad correcta
                    cantidad: producto.cantidad
                };
            });

            let datos = {
                receta_id: this.recetaId,
                producto: productos
            };

            this.recipesService.createRecipesProducts(datos).subscribe(
                (response) => {
                    Swal.fire({
                        title: "Exito",
                        text: response.msm,
                        icon: "success"
                    });
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un error al guardar las recetas.",
                        icon: "error"
                    });
                }
            );
        } else {
            Swal.fire({
                title: "Error",
                text: 'Por favor, agrega al menos un producto a la receta antes de guardar.',
                icon: "error"
            });
        }
    }

    // Paginador

    onPage(event) {
        this.pageCount = event['rows'];
        // this.getIndex('', this.pageCount);
    }

    onPageChange(event){
        this.first = event.first;
        this.rows = event.rows;
    }

    leftTable(){
        this.pageActual = this.pageActual - 1;
        // this.getIndex('', this.pageCount, this.pageActual);
        this.validatePage();
    }

    rightTable(){
        this.pageActual = this.pageActual + 1;
        // this.getIndex('', this.pageCount, this.pageActual);
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
