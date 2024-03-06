import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsModule } from './products.module';
import { ProductsService } from 'src/app/content/service/dashboard/products.service';
import { Products } from 'src/app/content/models/dashboard/products.model';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload'; // Asegúrate de tener la ruta correcta aquí
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { NgxSpinnerService } from 'ngx-spinner';

export interface medida {
  nombre: string,
  id: number,
}

export interface inventario {
  nombre: string,
  id: number,
}

export interface visible {
  nombre: string,
  id: number,
}

export interface limiteCatidad {
  nombre: string,
  id: number,
}

export interface tipo {
  nombre: string,
  id: number,
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {

    public productsData: Products[];
    public countRegisters: number;
    public visibleModalProducto: boolean = true;
    public ventaVisible: boolean = false;
    public formCreateProduct: FormGroup;
    public formSearch: FormGroup;
    public formEditProduct: FormGroup;
    public pageCount: number = 10;
    public medida: medida [];
    public inventario: inventario [];
    public visibleVenta: visible [];
    public visibleReceta: visible [];
    public limiteCantidad: limiteCatidad [];
    public tipo: tipo [];
    public imagen: any = null;
    public loadingTable :boolean = false;
    public visibleModalProductoEditar:boolean = false;
    public dataEditarInfoProductos: any;
    public idEditando:number = 0;
    public first:number = 0;
    public rows:number = 8;
    public data = Array(18).fill(0);
    public pageActual:number = 1;
    public ultimaPage:number = 1;
    public disablePageLeft: boolean = false;
    public disablePageRight: boolean = false;
    public registrosContar: number = 0;
    public visibleServicio: boolean = true;
    public visibleServicioEditar: boolean = true;
    public editarData: any;

    @ViewChild('fileUpload') fileUpload!: FileUpload;
    @ViewChild('fileUploadCreate') fileUploadCreate!: FileUpload;


    ngOnInit(): void {
      this.buildForm();
      this.getIndex();
      this.visibleModalProducto = false;
    }

    constructor(
      private productsService: ProductsService,
      private FB: FormBuilder,
      private spinner: NgxSpinnerService
    ){

    }

    openModal(){
      this.onCreate();
    }

    getIndex(search:string = '', pageCount:number = this.pageCount, page: number = 1){
      this.spinner.show();
      this.loadingTable = true;
      this.productsService.getAll(pageCount, search, page).subscribe(
        (response: any) => {
            this.loadingTable = false;
            this.productsData = response.data;
            this.ultimaPage = response.last_page;
            this.registrosContar = response.total;
            this.ultimaPage = response.last_page;
            if(response.total>pageCount){
                this.disablePageRight = true;
            }
            this.validatePage();
            this.spinner.hide();
        },
        (error) => {
            console.log('Error: ', error);
        }
      );
    }

    newProduct(){
      this.spinner.show();
      let dataProduct = this.formCreateProduct.value;
      dataProduct.inventario_id = dataProduct.inventario_id['id'];
      dataProduct.visible_venta = dataProduct.visible_venta['id'];
      dataProduct.tipo_producto = dataProduct.tipo_producto['id'];
      dataProduct.visible_receta = dataProduct.visible_receta['id'];
      dataProduct.estado = 1;

      if(dataProduct.tipo_producto != 2){
        dataProduct.medida_id = dataProduct.medida_id['id'];
        dataProduct.limite_cantidad = dataProduct.limite_cantidad['id'];

      } else {
        dataProduct.cantidad = 0;
        dataProduct.limite_cantidad = 0;
        dataProduct.medida_id = 0;
        dataProduct.precio_base = 0;
        dataProduct.stop_minimo = 0;
      }


      const formData = new FormData();

      for (const i in dataProduct) {
        if (dataProduct.hasOwnProperty(i)) {
          formData.append(i, dataProduct[i]);
        }
      }

      if(this.imagen!=null){
        const blobImage = new Blob([this.imagen], { type: 'image/png' });
        const file = new File([blobImage], 'nombre_archivo.png', { type: 'image/png' });
        formData.append('imagen', file);
      }


      this.productsService.createProduct(formData).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.imagen = null;
          this.visibleModalProducto = false;
          if(response.code == "success"){

            Swal.fire({
              title: "Exito",
              text: "Producto creado exitosamente.",
              icon: "success"
            });

            this.getIndex();

          }  else {

            Swal.fire({
              title: "Error",
              text: "Error al crear el producto." ,
              icon: "error"
            });

          }

        },
        (error) => {
            console.log('Error: ', error);
        }
      );
    }

    buildForm(){

      this.formSearch = this.FB.group({
        search: ['',[]],
      });

      this.formCreateProduct = this.FB.group({
          nombre: ['',[Validators.required]],
          medida_id: ['',[Validators.required]],
          descripcion: ['',[Validators.required]],
          precio: ['',[Validators.required, Validators.min(1)]],
          cantidad: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(0)]],
          inventario_id: ['',[Validators.required]],
          visible_venta: ['',[Validators.required]],
          visible_receta: ['',[Validators.required]],
          precio_base: ['',[Validators.required, Validators.min(0)]],
          limite_cantidad: ['',[Validators.required]],
          stop_minimo: ['',[Validators.required, Validators.min(0)]],
          tipo_producto: ['',[Validators.required]],
      });

      this.formEditProduct = this.FB.group({
        nombre: ['',[Validators.required]],
        medida_id: ['',[Validators.required]],
        descripcion: ['',[Validators.required]],
        precio: ['',[Validators.required, Validators.min(1)]],
        cantidad: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(0)]],
        inventario_id: ['',[Validators.required]],
        visible_venta: ['',[Validators.required]],
        visible_receta: ['',[Validators.required]],
        precio_base: ['',[Validators.required, Validators.min(0)]],
        limite_cantidad: ['',[Validators.required]],
        stop_minimo: ['',[Validators.required, Validators.min(0)]],
        tipo_producto: ['',[Validators.required]],
      });

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

    onPage(event){
      this.pageCount = event['rows'];
      this.getIndex('', this.pageCount);
    }

    onCreate(){
      this.fileUploadCreate.clear();
      this.imagen = null;
      this.formCreateProduct.reset();
      this.productsService.getProducto(0).subscribe(
      (response: any) => {
        this.medida = response.medida;
        this.inventario = response.inventario;
        this.visibleVenta = response.visible_venta;
        this.visibleReceta = response.visible_receta;
        this.limiteCantidad = response.sin_limite;
        this.tipo = response.tipo;
        this.visibleModalProducto = true;
        this.registrosContar = response.total;
        // this.imagen = 'data:image/png;base64,' + response.imagen;
       // this.cargarImagen(response.imagen);
      },
      (error) => {
          console.log('Error: ', error);
      }
      )
    }

    editProduct(id:number){
      this.imagen = null;
      this.fileUpload.clear();
      this.idEditando = id;
      this.spinner.show();
      this.productsService.getProducto(id).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.medida = response.medida;
          this.inventario = response.inventario;
          this.visibleVenta = response.visible_venta;
          this.visibleReceta = response.visible_receta;
          this.limiteCantidad = response.sin_limite;
          this.tipo = response.tipo;
          this.dataEditarInfoProductos = response.producto;

          let medida:any = null;
          let inventario:any = null;
          let sinLimite:any = null;
          let tipoProducto:any = null;
          let visibleVenta:any = null;
          let visibleReceta:any = null;

          this.medida.forEach((value) => {
            if(value.id == this.dataEditarInfoProductos.medida_id){
              medida = value;
            }
          })

          this.inventario.forEach((value) => {
            if(value.id == this.dataEditarInfoProductos.inventario_id){
              inventario = value;
            }
          })

          this.limiteCantidad.forEach((value) => {
            if(value.id == this.dataEditarInfoProductos.sin_limite_cantidad){
              sinLimite = value;
            }
          })

          this.tipo.forEach((value) => {
            if(value.id == this.dataEditarInfoProductos.tipo_producto){
              tipoProducto = value;
            }
          })

          this.visibleVenta.forEach((value) => {
            if(value.id == this.dataEditarInfoProductos.visible_venta){
              visibleVenta = value;
            }
          })

          this.visibleReceta.forEach((value) => {
            if(value.id == this.dataEditarInfoProductos.visible_receta){
              visibleReceta = value;
            }
          })

          setTimeout(() => {
            this.formEditProduct.get('nombre').setValue(this.dataEditarInfoProductos.nombre)
            this.formEditProduct.get('medida_id').setValue(medida)
            this.formEditProduct.get('descripcion').setValue(this.dataEditarInfoProductos.descripcion)
            this.formEditProduct.get('precio').setValue(this.dataEditarInfoProductos.precio)
            this.formEditProduct.get('cantidad').setValue(this.dataEditarInfoProductos.cantidad)
            this.formEditProduct.get('inventario_id').setValue(inventario)
            this.formEditProduct.get('visible_venta').setValue(visibleVenta)
            this.formEditProduct.get('limite_cantidad').setValue(sinLimite)
            this.formEditProduct.get('stop_minimo').setValue(this.dataEditarInfoProductos.stop_minimo)
            this.formEditProduct.get('tipo_producto').setValue(tipoProducto)
            this.formEditProduct.get('precio_base').setValue(this.dataEditarInfoProductos.precio_base)
            this.formEditProduct.get('visible_receta').setValue(visibleReceta)

            this.visibleModalProductoEditar = true;
            this.cargarImagen(response.imagen);
          }, 1);

        },
        (error) => {
            console.log('Error: ', error);
        }
      );
    }

    cargarImagen(base64String:string){

      // Convierte la cadena base64 a un arreglo de bytes
      const byteCharacters = atob(base64String);

      // Crea un arreglo de bytes en formato uint8
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Crea un objeto Uint8Array y luego un Blob
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Agrega el Blob al componente FileUpload
      const archivo = new File([blob], 'nombre_archivo.jpg', { type: 'image/jpeg' });
      this.fileUpload.clear();

      this.fileUpload.files = [archivo];
    }

    submitCreate(){
      //this.newProduct();
      if(this.formCreateProduct.valid){
        this.newProduct();
      } else {
        this.formCreateProduct.markAllAsTouched();
      }
    }

    onSelect(event) {
      this.imagen = event.currentFiles[0]//.objectURL.changingThisBreaksApplicationSecurity;
    }

    blobToBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Error al convertir Blob a Base64'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Error al leer el Blob'));
        };

        reader.readAsDataURL(blob);
      });
    }

    confirmDelete(id:number){
      Swal.fire({
        title: "¿Estas Seguro que deseas eliminar el producto?",
        text: "Ten cuidado esta acción no se prodrá reversar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Confirmar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.productsService.eliminarProduct({id}).subscribe(
            (response: any) => {
              this.spinner.hide();
              if(response.code == "success"){

                Swal.fire({
                  title: "Exito",
                  text: "Producto eliminado exitosamente.",
                  icon: "success"
                });

                this.getIndex();

              }  else {

                Swal.fire({
                  title: "Error",
                  text: "Error al eliminar el producto." ,
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

    onRemove(event){
      this.imagen = null;
    }

    updateProducto(){
      this.spinner.show();
      let dataProduct = this.formEditProduct.value;

      dataProduct.inventario_id = dataProduct.inventario_id['id'];
      dataProduct.visible_venta = dataProduct.visible_venta['id'];
      dataProduct.tipo_producto = dataProduct.tipo_producto['id'];
      dataProduct.visible_receta = dataProduct.visible_receta['id'];
      dataProduct.id = this.idEditando;
      dataProduct.estado = 1;

      if(dataProduct.tipo_producto != 2){
        dataProduct.medida_id = dataProduct.medida_id['id'];
        dataProduct.limite_cantidad = dataProduct.limite_cantidad['id'];

      } else {
        dataProduct.cantidad = 0;
        dataProduct.limite_cantidad = 0;
        dataProduct.medida_id = 0;
        dataProduct.precio_base = 0;
        dataProduct.stop_minimo = 0;
      }

      const formData = new FormData();

      for (const i in dataProduct) {
        if (dataProduct.hasOwnProperty(i)) {
          formData.append(i, dataProduct[i]);
        }
      }

      if(this.imagen!=null){
        const blobImage = new Blob([this.imagen], { type: 'image/png' });
        const file = new File([blobImage], 'nombre_archivo.png', { type: 'image/png' });
        formData.append('imagen', file);
      }


      this.productsService.updateProducto(formData).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.imagen = null;
          this.visibleModalProductoEditar = false;
          if(response.code == "success"){

            Swal.fire({
              title: "Exito",
              text: "Producto creado exitosamente.",
              icon: "success"
            });

            this.getIndex();

          }  else {

            Swal.fire({
              title: "Error",
              text: "Error al editar el producto." ,
              icon: "error"
            });

          }

        },
        (error) => {
            console.log('Error: ', error);
        }
      );
    }

    submitUpdate(){
      if(this.formEditProduct.valid){
        this.updateProducto();
      }
    }

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

    onChangeTipoProductoCrear (){
      let tipo_producto = this.formCreateProduct.get('tipo_producto').value;

      if(tipo_producto.id == 1){
        //producto
        this.visibleServicio = true;
        this.formCreateProduct.get('medida_id').enable();
        this.formCreateProduct.get('cantidad').enable();
        this.formCreateProduct.get('limite_cantidad').enable();
        this.formCreateProduct.get('stop_minimo').enable();
        this.formCreateProduct.get('precio_base').enable();
        this.formCreateProduct.get('visible_receta').enable();

        this.formCreateProduct.get('cantidad').setValue(null);
        this.formCreateProduct.get('medida_id').setValue(null);
        this.formCreateProduct.get('limite_cantidad').setValue(null);
        this.formCreateProduct.get('stop_minimo').setValue(null);
        this.formCreateProduct.get('precio_base').setValue(null);
        this.formCreateProduct.get('visible_receta').setValue(null);

      }

      if(tipo_producto.id == 2){
        //servicio
        this.visibleServicio = false;
        this.formCreateProduct.get('medida_id').disable();
        this.formCreateProduct.get('cantidad').disable();
        this.formCreateProduct.get('limite_cantidad').disable();
        this.formCreateProduct.get('stop_minimo').disable();
        this.formCreateProduct.get('precio_base').disable();
        this.formCreateProduct.get('visible_receta').disable();

        this.formCreateProduct.get('cantidad').setValue(0);
        this.formCreateProduct.get('medida_id').setValue(0);
        this.formCreateProduct.get('limite_cantidad').setValue(0);
        this.formCreateProduct.get('stop_minimo').setValue(0);
        this.formCreateProduct.get('precio_base').setValue(0);
        this.formCreateProduct.get('visible_receta').setValue(0);
      }
    }

    onChangeTipoProductoEditar(){
      let tipo_producto = this.formEditProduct.get('tipo_producto').value;
      if(tipo_producto.id == 1){

        //producto
        this.visibleServicioEditar = true;
        this.formEditProduct.get('medida_id').enable();
        this.formEditProduct.get('cantidad').enable();
        this.formEditProduct.get('limite_cantidad').enable();
        this.formEditProduct.get('stop_minimo').enable();
        this.formEditProduct.get('precio_base').enable();

        this.formEditProduct.get('cantidad').setValue(this.editarData.cantidad);
        this.formEditProduct.get('medida_id').setValue(this.editarData.medida_id);
        this.formEditProduct.get('limite_cantidad').setValue(this.editarData.limite_cantidad);
        this.formEditProduct.get('stop_minimo').setValue(this.editarData.stop_minimo);
        this.formEditProduct.get('precio_base').setValue(this.editarData.precio_base);
      }

      if(tipo_producto.id == 2){
        this.editarData =  this.formEditProduct.value;

        //servicio
        this.visibleServicioEditar = false;
        this.formEditProduct.get('cantidad').disable();
        this.formEditProduct.get('limite_cantidad').disable();
        this.formEditProduct.get('stop_minimo').disable();
        this.formEditProduct.get('precio_base').disable();

        this.formEditProduct.get('cantidad').setValue(0);
        this.formEditProduct.get('medida_id').setValue(0);
        this.formEditProduct.get('limite_cantidad').setValue(0);
        this.formEditProduct.get('stop_minimo').setValue(0);
        this.formEditProduct.get('precio_base').setValue(0);
      }
    }

}
