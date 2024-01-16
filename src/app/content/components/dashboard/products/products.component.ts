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

    getIndex(search:string = '', page:number = this.pageCount){
      this.spinner.show();
      this.loadingTable = true;
      this.productsService.getAll(page, search).subscribe(
        (response: any) => {
          this.loadingTable = false;
            console.log('Response: ', response);
            this.productsData = response.data;
            this.countRegisters = response.total;
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
      dataProduct.medida_id = dataProduct.medida_id['id'];
      dataProduct.inventario_id = dataProduct.inventario_id['id'];
      dataProduct.visible_venta = dataProduct.visible_venta['id'];
      dataProduct.limite_cantidad = dataProduct.limite_cantidad['id'];
      dataProduct.tipo_producto = dataProduct.tipo_producto['id'];
      dataProduct.estado = 1;



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
        precio_base: ['',[Validators.required, Validators.min(0)]],
        limite_cantidad: ['',[Validators.required]],
        stop_minimo: ['',[Validators.required, Validators.min(0)]],
        tipo_producto: ['',[Validators.required]],
      });

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
        this.limiteCantidad = response.sin_limite;
        this.tipo = response.tipo;
        this.visibleModalProducto = true;
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
          this.limiteCantidad = response.sin_limite;
          this.tipo = response.tipo;
          this.dataEditarInfoProductos = response.producto;

          let medida:any = null;
          let inventario:any = null;
          let sinLimite:any = null;
          let tipoProducto:any = null;
          let visibleVenta:any = null;

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

          console.log( )
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
      dataProduct.medida_id = dataProduct.medida_id['id'];
      dataProduct.inventario_id = dataProduct.inventario_id['id'];
      dataProduct.visible_venta = dataProduct.visible_venta['id'];
      dataProduct.limite_cantidad = dataProduct.limite_cantidad['id'];
      dataProduct.tipo_producto = dataProduct.tipo_producto['id'];
      dataProduct.id = this.idEditando;
      dataProduct.estado = 1;



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

    submitUpdate(){
      if(this.formEditProduct.valid){
        this.updateProducto();
      }
    }

    onPageChange(event){
      this.first = event.first;
      this.rows = event.rows;
    }
}
