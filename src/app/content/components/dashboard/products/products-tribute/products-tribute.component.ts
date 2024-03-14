import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ex } from '@fullcalendar/core/internal-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeNode } from 'primeng/api';
import { ProductsService } from 'src/app/content/service/dashboard/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-tribute',
  templateUrl: './products-tribute.component.html',
  styleUrls: ['./products-tribute.component.scss']
})
export class ProductsTributeComponent {
  
  cols: any[] = [];
  impuestosData: any[] = [];
  files3: TreeNode[] = [];
  loadingTable:boolean = true;
  impuestoModalCrear:boolean = false;
  formCreate: FormGroup; 
  impuestos: any;
  id: number;

  constructor(
    private FB: FormBuilder, 
    private productsService: ProductsService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {   
    this.impuestosData = [];

    this.route.params.subscribe(params => {
      this.id = params['id'];
    }); 

    this.loadingTable = false;

    this.formCreate = this.FB.group({
      impuesto:['', Validators.required]
    });

    setTimeout(() => {
      this.loadImpuesto();
    });
  }

  submitCreate(){
    this.impuestoModalCrear = false;  

    let existe = this.impuestosData.filter(element => element?.id == this.formCreate.get('impuesto').value['id']);
 
    if(existe.length == 0){
      this.impuestosData.push({
        nombre: this.formCreate.get('impuesto').value['nombre'],
        porcentaje: this.formCreate.get('impuesto').value['porcentaje'],
        id: this.formCreate.get('impuesto').value['id'], 
      })
    } else {      
      Swal.fire({
        title: "Advertecia",
        text: "El Impuesto ya fue agregado." ,
        icon: "warning"
      });
    } 

  }

  openModalCrear(){
    this.impuestoModalCrear = true; 
    this.getImpuestoCrear();
  }

  onChangeCreateImpuesto(){
  
  }

  confirmDelete(id: number){
    this.impuestosData = this.impuestosData.filter(element => element.id != id);
  }

  loadImpuesto(){
    this.productsService.getImpuesto(this.id).subscribe(element => {
      let impuestoProducto = element.impuestoProducto;
      impuestoProducto.forEach(element => {
        this.impuestosData.push({
          nombre: element.impuesto.nombre ,
          porcentaje: element.impuesto.porcentaje,
          id: element.impuesto_id, 
        })
      });
    })
  }

  getImpuestoCrear(){
    this.spinner.show();
    this.productsService.getImpuestoCrear().subscribe(
      (response: any) => {   
        this.spinner.hide();
        this.impuestos = response.impuestos;
      }
    )
  }

  saveImpuesto(element: any){
    this.productsService.createImpuesto(element).subscribe(Response => {
      if(Response.val){
        Swal.fire({
          title: "Exito",
          text: Response.msm ,
          icon: "success"
        });
      } else {
        Swal.fire({
          title: "Error",
          text: Response.msm ,
          icon: "error"
        }); 
      }
    })
  }

  enviarImpuesto(){
    
   // if( this.impuestosData.length > 0){
      let element = {
        impuestos: this.impuestosData,
        id: this.id,
      };

      this.saveImpuesto(element);
  //  }
  }
}
