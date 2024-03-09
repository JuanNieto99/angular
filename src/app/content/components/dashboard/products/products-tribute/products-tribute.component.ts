import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ProductsService } from 'src/app/content/service/dashboard/products.service';

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
  impuesto: any;

  constructor(
    private FB: FormBuilder, 
    private productsService: ProductsService,
  ) {}

  ngOnInit() {   
    this.impuestosData = [
      { nombre: 'IVA', porcentaje: 19, opcion: ''} 
    ];

    this.loadingTable = false;

    this.formCreate = this.FB.group({
      impuesto:['', Validators.required]
    });
  }

  submitCreate(){
  
  }

  openModalCrear(){
    this.impuestoModalCrear = true; 
  }

  onChangeCreateImpuesto(){
  
  }

  loadImpuesto(){
    this.productsService.getImpuesto().subscribe(element => {
    
    })
  }
}
