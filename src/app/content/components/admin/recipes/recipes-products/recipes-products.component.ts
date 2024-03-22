import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipesService } from '../../../../service/recipes/recipes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map } from 'rxjs';

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
    public productosGuardados: any[];
    public productosParaMostrar: any[];
    public productosParaEnviar: any[];
    public displayModalProducts: boolean = false;
    public displayModalTaxes: boolean = false;

    //Variables impuestos
    public formImpuesto: FormGroup;
    public formTaxes: FormGroup;
    public taxesData: any[] = [];
    public impuestosParaMostrar: any[];
    public impuestosGuardados: any[];
    public impuestosSeleccionados: any[] = [];

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
        this.getProductsAndRecipesList(this.recetaId)
        this.getProductsForRecipe(this.recetaId);
        this.getTaxesAndRecipesList(this.recetaId);
        this.getTaxesById(this.recetaId);
    }

    buildForm(){
        this.form = this.FB.group({
            nombreReceta: [this.dataRecipesDetail?.detalleRecipes?.recipes?.nombre, []],
            descripcion: [this.dataRecipesDetail?.detalleRecipes?.descripcion, []],
            precio: [this.dataRecipesDetail?.detalleRecipes?.precio, []],
            //hotel: [this.dataRecipesDetail?.detalleRecipes?.hotel, []],
        });

        this.formImpuesto = this.FB.group({
            impuesto_id: [null, Validators.required], // Control para el ID del impuesto seleccionado
            nombre: [''], // Control para el nombre del impuesto (puede ser opcional)
            porcentaje: ['', Validators.required] // Control para el porcentaje del impuesto
        });


        // Deshabilita los campos del formulario
        this.form.get('nombreReceta').disable();
        this.form.get('descripcion').disable();
        this.form.get('precio').disable();

        this.formProducto  = this.FB.group({
            producto_id: [null, [Validators.required]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
        });

        this.formTaxes = this.FB.group({
            impuesto_id: [null, [Validators.required]]
        })
    }


    /// Modal ///
    // Abre el modal
    openModal() {
        this.displayModalProducts = true;
    }

    // Cierra el modal
    closeModal() {
        this.displayModalProducts = false;
    }

    // Loading product

    getProductsAndRecipesList(id: number){
        this.loadingTable = true;
        this.recipesService.getProducts(id).subscribe(
            (response: any) => {
                this.productsData = response.productos;
                this.loadingTable = false;

                // Convierte el precio a número y luego lo formatea con separadores de miles
                const precioFormateado = Number(response.receta.precio).toLocaleString('es-CO');

                // Establece los valores de los inputs con la información de la receta
                this.form.get('nombreReceta').setValue(response.receta.nombre);
                this.form.get('precio').setValue(`$${precioFormateado}`);
                this.form.get('descripcion').setValue(response.receta.descripcion);

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

    // Products selected
    agregarProductos() {
        // Obtiene el producto seleccionado del formulario
        const productoSeleccionado = this.formProducto.get('producto_id').value;
        const cantidad = this.formProducto.get('cantidad').value;

        // Verifica si el usuario ha seleccionado un producto
        if (productoSeleccionado) {
            // Inicializa productosGuardados y productosSeleccionados como arrays vacíos si son null o undefined
            this.productosGuardados = this.productosGuardados || [];
            this.productosSeleccionados = this.productosSeleccionados || [];

            // Agrega la cantidad al objeto del producto
            productoSeleccionado.cantidad = Number(cantidad);
            this.productosSeleccionados.push({
                producto_id: productoSeleccionado.id,
                nombre: productoSeleccionado.nombre,
                descripcion: productoSeleccionado.descripcion,
                cantidad: Number(cantidad)
            });
            console.log('Producto agregado:', {producto_id: productoSeleccionado.id, cantidad: Number(cantidad)}); // Agrega esta línea

            // Actualiza productosParaMostrar con los productos guardados y los productos seleccionados
            this.productosParaMostrar = [...this.productosGuardados, ...this.productosSeleccionados];

            this.cdr.detectChanges();

            // Resetea los campos 'producto_id' y 'cantidad' del formulario
            this.formProducto.get('producto_id').setValue(null);
            this.formProducto.get('cantidad').setValue(0);
            this.closeModal();
        } else {
            console.error('Por favor, selecciona un producto antes de agregar.');
        }
    }

    getProductsForRecipe(recetaId: number) {
        this.loadingTable = true; // Mostrar spinner de carga
        this.recipesService.getProductsRecetas(recetaId).subscribe(
            (response: any) => {
                // Verifica si hay datos en la respuesta
                if (response && response.receta && response.receta.length > 0) {
                    // Mapea los datos recibidos para adaptarlos a la estructura de la tabla
                    this.productosGuardados = response.receta.map(item => ({
                        id: item.productos.id, // Asegúrate de que estás capturando el id del producto
                        nombre: item.productos.nombre,
                        cantidad: item.cantidad,
                        descripcion: item.productos.descripcion
                        // Puedes agregar más propiedades aquí si necesitas mostrar más información en la tabla
                    }));
                } else {
                    // Si no hay datos en la respuesta, muestra un mensaje o realiza alguna acción adecuada
                    console.log('No se encontraron productos asociados a esta receta.');
                    this.productosGuardados = []; // Vacía la tabla
                }
                // Combina productosGuardados y productosSeleccionados
                this.productosParaMostrar = [...this.productosGuardados, ...this.productosSeleccionados];
                this.loadingTable = false; // Ocultar spinner de carga
            },
            (error) => {
                console.error(error);
                this.loadingTable = false; // Ocultar spinner de carga en caso de error
            }
        );
    }

    sendProducts() {
        console.log('this.productosSeleccionados:', this.productosSeleccionados);
        console.log('this.productosSeleccionados.length:', this.productosSeleccionados ? this.productosSeleccionados.length : 'undefined');

        // Combina los productos consultados y los nuevos productos
        const todosLosProductos = [...this.productosGuardados, ...this.productosSeleccionados];

        // Verifica si todosLosProductos es un array
        if (Array.isArray(todosLosProductos)) {
            let datos = {
                receta_id: this.recetaId, // Cambia 'recetaId' por 'receta_id'
                producto: todosLosProductos.map(producto => ({
                    producto_id: producto.producto_id ? producto.producto_id : producto.id,
                    cantidad: String(producto.cantidad) // Convierte 'cantidad' a una cadena
                }))
            };

            this.recipesService.createRecipesProducts(datos).subscribe(
                (response) => {
                    if (response.val) {
                        // Actualiza la lista de productos
                        this.getProductsForRecipe(this.recetaId)
                    }
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un error al guardar los productos.",
                        icon: "error"
                    });
                }
            );
        } else {
            Swal.fire({
                title: "Error",
                text: 'Hubo un error al guardar los productos.',
                icon: "error"
            });
        }

        // Muestra el mensaje de éxito
        Swal.fire({
            title: "Exito",
            text: "Los productos se han guardado correctamente.",
            icon: "success"
        });
    }

    //ELIMINAR DEL ARREGLO
    quitarProducto(productoAEliminar) {
        // Encuentra el índice del producto en el arreglo productosSeleccionados
        let indice = this.productosSeleccionados.findIndex(producto => producto === productoAEliminar);

        // Verifica si el producto está en el arreglo productosSeleccionados
        if (indice !== -1) {
            // Si el producto está en el arreglo, lo elimina
            this.productosSeleccionados.splice(indice, 1);
        } else {
            // Si el producto no está en productosSeleccionados, busca en productosGuardados
            indice = this.productosGuardados.findIndex(producto => producto === productoAEliminar);
            if (indice !== -1) {
                // Si el producto está en productosGuardados, lo elimina
                this.productosGuardados.splice(indice, 1);
            }
        }

        // Actualiza productosParaMostrar con los productos guardados y los productos seleccionados
        this.productosParaMostrar = [...this.productosGuardados, ...this.productosSeleccionados];

        this.cdr.detectChanges();
    }

    ///<---------IMPUESTOS----------->///

    //Taxes Modal
    openModalTaxes(){
        this.displayModalTaxes = true
    }

    closeModalTaxes(){
        this.displayModalTaxes= false
    }

    //Get Taxes
    getTaxesAndRecipesList(id: number){
        this.loadingTable = true;
        this.recipesService.getTaxes(id).subscribe(
            (response: any) => {
                this.taxesData = response.impuesto;
                this.loadingTable = false;
            },
            (error) => {
                console.error(error);
                this.loadingTable = false;
            }
        );
    }

    //Add Taxes

    agregarImpuestos() {
        const impuestoIdSeleccionado = this.formImpuesto.get('impuesto_id').value.id;

        const impuestoSeleccionado = this.taxesData.find(impuesto => impuesto.id === impuestoIdSeleccionado);

        if (impuestoSeleccionado) {
            this.impuestosGuardados = this.impuestosGuardados || [];
            this.impuestosSeleccionados = this.impuestosSeleccionados || [];

            // Asigna el porcentaje del impuesto seleccionado
            const porcentaje = impuestoSeleccionado.porcentaje;

            this.impuestosSeleccionados.push({
                impuesto_id: impuestoSeleccionado.id,
                nombre: impuestoSeleccionado.nombre,
                porcentaje: Number(porcentaje)
            });

            this.impuestosParaMostrar = [...this.impuestosGuardados, ...this.impuestosSeleccionados];

            this.cdr.detectChanges();

            this.formImpuesto.get('impuesto_id').setValue(null);
            this.closeModalTaxes();
        } else {
            console.error('Por favor, selecciona un impuesto antes de agregar.');
        }
    }

    //Get Taxes by id

    getTaxesById(recetaId: number) {
        this.loadingTable = true; // Mostrar spinner de carga
        this.recipesService.getRecipeTaxes(recetaId).subscribe(
            (response: any) => {
                // Verifica si hay datos en la respuesta
                if (response && response.receta_impuesto && response.receta_impuesto.length > 0) {
                    // Mapea los datos recibidos para adaptarlos a la estructura de la tabla
                    this.impuestosGuardados = response.receta_impuesto.map(item => ({
                        id: item.impuesto.id,
                        nombre: item.impuesto.nombre,
                        porcentaje: item.impuesto.porcentaje
                    }));
                } else {
                    console.log('No se encontraron impuestos asociados a esta receta.');
                    this.impuestosGuardados = []; // Vacía la tabla
                }
                // Combina impuestosGuardados e impuestosSeleccionados
                this.impuestosParaMostrar = [...this.impuestosGuardados, ...this.impuestosSeleccionados];
                this.loadingTable = false; // Ocultar spinner de carga
            },
            (error) => {
                console.error(error);
                this.loadingTable = false; // Ocultar spinner de carga en caso de error
            }
        );
    }

    //Save Taxes

    sendTaxes() {
        console.log('this.impuestosSeleccionados:', this.impuestosSeleccionados);
        console.log('this.impuestosSeleccionados.length:', this.impuestosSeleccionados ? this.impuestosSeleccionados.length : 'undefined');

        // Verifica si hay impuestos seleccionados
        if (Array.isArray(this.impuestosSeleccionados)) {
            let datos = {
                receta_id: this.recetaId,
                impuestos: Array.isArray(this.impuestosSeleccionados) ? this.impuestosSeleccionados.map(impuesto => ({
                    impuesto_id: impuesto.impuesto_id
                })) : []
            };
            console.log('datos:', datos);

            this.recipesService.createTaxes(datos).subscribe(
                (response) => {
                    console.log('response:', response);
                    if (response.val) {
                        // Actualiza la lista de impuestos
                        this.getTaxesById(this.recetaId)
                    }
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un error al guardar los impuestos.",
                        icon: "error"
                    });
                }
            );
        } else {
            Swal.fire({
                title: "Error",
                text: 'Por favor, agrega al menos un impuesto a la receta antes de guardar.',
                icon: "error"
            });
        }

        // Muestra el mensaje de éxito
        Swal.fire({
            title: "Exito",
            text: "Los impuestos se han guardado correctamente.",
            icon: "success"
        });
    }

    //Eliminar tarifas

    quitarTaxes(impuestoAEliminar) {
        // Encuentra el índice del impuesto en el arreglo impuestosSeleccionados
        let indice = this.impuestosSeleccionados.findIndex(impuesto => impuesto === impuestoAEliminar);

        // Verifica si el impuesto está en el arreglo impuestosSeleccionados
        if (indice !== -1) {
            // Si el impuesto está en el arreglo, lo elimina
            this.impuestosSeleccionados.splice(indice, 1);
        } else {
            // Si el impuesto no está en impuestosSeleccionados, busca en impuestosGuardados
            indice = this.impuestosGuardados.findIndex(impuesto => impuesto === impuestoAEliminar);
            if (indice !== -1) {
                // Si el impuesto está en impuestosGuardados, lo elimina
                this.impuestosGuardados.splice(indice, 1);
            }
        }

        // Actualiza impuestosParaMostrar con los impuestos guardados y los impuestos seleccionados
        this.impuestosParaMostrar = [...this.impuestosGuardados, ...this.impuestosSeleccionados];

        this.cdr.detectChanges();
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
