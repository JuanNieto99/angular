import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme } from '@fullcalendar/core/internal';
import { el } from '@fullcalendar/core/internal-common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-rooms-ocupar',
  templateUrl: './dashboard-rooms-ocupar.component.html',
  styleUrls: ['./dashboard-rooms-ocupar.component.scss']
})
export class DashboardRoomsOcuparComponent {

  public form: FormGroup;  
  public formTarifa: FormGroup;  
  public formProducto: FormGroup;  
  public formMetodoPago: FormGroup; ç
  public formReceta: FormGroup;   
  public formFacturacionMediosPago: FormArray;  
  public habitacionId: number; 
  public dataRoomDetail: any;
  public dataTarifa: any[] = [];
  public dataMetodosPago: any;
  public dataAbonos: any[] = [];
  public tarifasTotal: number = 0;
  public abonosTotal: number = 0;
  public items: MenuItem[] = [];
  public totalPagarReserva: number = 0;
  public subtotaltotalPagarReserva: number = 0; 
  public detalleAbonoId: number;
  public totalProductos: number = 0;
  public dataProductos: any[] = [];
  public dataReceta: any[] = [];
  public tarifaVisible: boolean = false;
  public productoVisible: boolean = false;
  public abonoVisible: boolean = false;
  public recetaVisible: boolean = false;
  public allTarifas: any[] = [];
  public allTarifasDefault: any[] = [];
  public productoData: any[] = [];
  public estadoHabitacion: any;
  public disableFactura: boolean;
  public facturarVisible: boolean;
  public totalFactura: number = 0;
  public impuestos: any;
  public totalImpuestos: number = 0;
  public impuestosData: any [] = [];
  public detalleId: number = 0;
  public hotelId: number = 0;
  public clienteId: number = 0;
  private impuestos_save: any = [];
  public totalRecetas: number = 0;
  public recetasData: any = [];

  constructor( 
    private dashboardRoomsService:DashboardRoomsService, 
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
  ){ 
    this.formFacturacionMediosPago = this.FB.array([]); 
  }

  ngOnInit(){
    this.spinner.hide();
    this.dataRoomDetail = [];
    this.habitacionId = parseFloat(this.route.snapshot.paramMap.get('idHabitacion'));  
    this.buildForm();
    this.getRoomOcupar(); 
  } 

  cargarItems(){  
    this.items = [
      { label: 'Facturar', icon: 'pi pi-dollar', disabled: this.disableFactura , command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'facturar') },
      { label: 'Desocupar', disabled:(this.estadoHabitacion?.estado_id==2?false:true), icon: 'pi pi-lock-open', command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'desocupar') }
    ];}

  buildForm(){
    this.form = this.FB.group({
      nombreHabitacion: [this.dataRoomDetail?.detalleHabitacion?.habitacion?.nombre, []],
      descripcion: [this.dataRoomDetail?.detalleHabitacion?.descripcion, []],
      nombreCliente: [this.dataRoomDetail?.detalleHabitacion?.cliente?.nombres+' '+this.dataRoomDetail?.detalleHabitacion?.cliente?.apellidos, []],
      desde: [this.dataRoomDetail?.detalleHabitacion?.checkin, []],
      hasta: [this.dataRoomDetail?.detalleHabitacion?.checkout, []],
    }); 

    this.formTarifa = this.FB.group({ 
      tarifa_id: [this.allTarifasDefault, [Validators.required]]
    });
 
    this.formProducto = this.FB.group({
      producto_id: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    }); 

    this.formMetodoPago = this.FB.group({
      metodo_pago_id: [null, [Validators.required]],
      valor: [null, [Validators.required, Validators.min(1)]],
    });

    this.formReceta = this.FB.group({
      receta_id: [null, [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    }); 

    let form =  this.FB.group({
      monto: ['', [Validators.required, Validators.min(0)]],
      medio_pago: [this.dataMetodosPago?this.dataMetodosPago[0]:null, [Validators.required, Validators.min(1)]],
    }); 
    this.formFacturacionMediosPago = this.FB.array([]); 

    this.formFacturacionMediosPago.push(
      form
    )

    this.form.disable();
  }

  getRoomOcupar(){
      let data = {
        habitacion_id : this.habitacionId,
      }
      
      this.spinner.show();
      
      this.dashboardRoomsService.getOcuparHabitacion(data).subscribe(reques => {
        this.spinner.hide();
        this.dataRoomDetail = reques; 
        this.estadoHabitacion = this.dataRoomDetail.estadoHabitacion;
        this.impuestos =  this.dataRoomDetail.impuesto;
        this.recetasData = this.dataRoomDetail.recetas; 
          console.log(this.recetasData)
        this.allTarifasDefault = [];
        this.dataRoomDetail.tarifasHabitacion.forEach(element => {   

          this.dataTarifa.push({
            
            valor: element.valor,
            nombre: element.tarifa?.nombre,
            tipo: element.tipo,
            id: element.item_id,
          //  identificador: identificador,
          }); 

        }); 


        this.dataRoomDetail.recetasHabitacion.forEach(element => { 
          let identificador ='receta'+this.generarIdAleatorio() ;
          let impuesto = 0;

          element?.recetas?.impuestos.forEach(receta_detalle_element => {  
              let totalImpuesto = parseInt(receta_detalle_element?.impuesto?.porcentaje) * ( parseFloat( element?.recetas.precio ) * parseInt (element?.cantidad) ) / 100; 
              impuesto = impuesto  + totalImpuesto;
            
             this.impuestos_save.push({
                'valor' :  totalImpuesto,
                'porcentaje' : receta_detalle_element?.impuesto?.porcentaje,
                'cantidad': element?.cantidad,
                'id': receta_detalle_element?.impuesto.id,
                'item_id':  element?.item_id,
                'tipo': '4',
                'identificador': identificador,
             });

          });    

          this.dataReceta.push({
            nombre: element?.recetas?.nombre,
            valor: element?.recetas?.precio,
            valorImpuesto: impuesto + parseFloat( element?.recetas?.precio),
            cantidad: element?.cantidad,
            id: element?.item_id,
            identificador: identificador, 
            impuestos: element.recetas?.impuestos
          });

          this.totalRecetas = this.totalRecetas + impuesto + parseFloat( element?.recetas?.precio);
        }); 

        

        this.dataMetodosPago = this.dataRoomDetail.metodos_pago;

        this.dataRoomDetail.productosHabitacion.forEach(element => {

            let impuesto = 0;   
            let identificador ='productos'+this.generarIdAleatorio()
      
            element.productos.impuestos.forEach(impuestoElement => {   
              let totalImpuesto = parseInt(impuestoElement.impuesto.porcentaje) * ( parseFloat(element?.valor) ) / 100;

               impuesto = impuesto + totalImpuesto;

               this.impuestos_save.push({
                'valor' :  totalImpuesto,
                'porcentaje' : impuestoElement.impuesto.porcentaje,
                'cantidad': element?.cantidad,
                'id': impuestoElement.impuesto.id,
                'item_id':  element?.item_id,
                'tipo': '1',
                'identificador': identificador,
              });

            });
          
            this.dataProductos.push({
                nombre: element?.productos.nombre,
                valor: element?.valor,
                valorImpuesto: impuesto + (parseFloat(element?.valor)  ),
                cantidad: element?.cantidad,
                id: element?.item_id,
                identificador: identificador,
                tipoProducto: element?.productos.tipo_producto,
                impuestos: element.productos.impuestos
            }); 

        });

        this.dataRoomDetail.abonoHabitacion.forEach(element => {
          this.dataAbonos.push(
            {
              valor: element.valor,
              nombre: element.metodo_pago.nombre,
              id: element.id,
              metodo_pago_id: element?.metodo_pago.id,
              identificador: 'abonos'+this.generarIdAleatorio(),
            }
          ); 
        });


        this.dataRoomDetail.tarifas.forEach(element => { 
      //    let identificador =  'tarifas'+this.generarIdAleatorio();
          this.allTarifas.push(
              {
                valor: element.valor,
                nombre: element.nombre,
                tipo: element.tipo,
                id:element.id,
               // identificador: identificador,
              }
          ); 
               
          if(this.dataRoomDetail.tarifasHabitacion.filter(elementFilter => (elementFilter?.tarifa?.id==element.id)).length>0){
            this.allTarifasDefault.push({
              valor: element.valor,          
              nombre: element.nombre,
              tipo: element.tipo,
              id:element.id,
            //  identificador: identificador,
            });
          } 

        }); 

        this.dataRoomDetail.productos.forEach(element => {  

          this.productoData.push(
            {
              id: element.id,
              nombre: element.nombre,
              valor: element.precio,  
              tipo: element.tipo_producto,
              impuestos: element.impuestos, 
            })
 
        })

        this.detalleId = this.dataRoomDetail?.detalleHabitacion.id;
        this.hotelId = this.dataRoomDetail?.detalleHabitacion.hotel_id;
        this.clienteId = this.dataRoomDetail?.detalleHabitacion.cliente?.id;
       // 
        this.buildForm();
        this.recalcular();
        this.cargarItems(); 

      })
  }

  recalcular(){

    this.tarifasTotal = 0;
    this.totalProductos = 0;
    this.abonosTotal = 0;
    this.totalPagarReserva = 0;
    this.totalImpuestos = 0;
    this.totalRecetas =0;
    
    this.dataTarifa.forEach(element => {
        this.tarifasTotal = this.tarifasTotal + parseFloat( element.valor ) ; 
    });

    let productoTotal = 0;
    
    this.dataProductos.forEach(element => {
       let valor = 0; 
       
        valor = parseFloat(element?.valorImpuesto) 
        this.totalImpuestos =  this.totalImpuestos + valor - element?.valor; 

        this.totalProductos = this.totalProductos + valor  ;
    }); 

    this.dataReceta.forEach(element => {
      let valor = parseFloat(element?.valorImpuesto)
      this.totalRecetas = this.totalRecetas + valor  ;
      this.totalImpuestos = this.totalImpuestos + valor - element?.valor;  
    })

    this.dataAbonos.forEach(element => {
      this.abonosTotal = this.abonosTotal + parseFloat( element.valor ) ;
    }); 

    // this.impuestos_save.forEach(element => {
    //   this.totalImpuestos = this.totalImpuestos  + element.valor;
    // });
    this.totalPagarReserva = (this.tarifasTotal +  this.totalProductos +  this.totalRecetas) - this.abonosTotal;
    this.subtotaltotalPagarReserva = (this.tarifasTotal +  this.totalProductos +  this.totalRecetas) - this.totalImpuestos;
    this.validaciones();
  }
/*
  cargarDefaul(){

    this.allTarifasDefault = [];

    this.dataTarifa.forEach(element => {
      let elementTarifa = element.tarifa

      this.allTarifasDefault.push(
        {
          id: elementTarifa.id,
          nombre: elementTarifa.nombre,
          valor: elementTarifa.valor,
          tipo: elementTarifa.tipo,
          identificador: 'tarifas'+this.generarIdAleatorio(),
        }
      );
    }); 


  }*/

  opcionSelect(select, opcion){
    if(opcion == "desocupar"){
      this.desocuparHabitacion();  
    }

    if(opcion == "facturar"){
      this.facturacion();
    }
  }


  confirmDeleteAbono(identificador:string){
    this.dataAbonos =  this.dataAbonos.filter(element => element.identificador != identificador);
    this.recalcular();
  }

  confirmDeleteTarifa(id:string){
    this.dataTarifa =  this.dataTarifa.filter(element => element.id != id);
    this.allTarifasDefault = this.dataTarifa; 
    this.buildForm();
    this.recalcular();
  }

  confirmDeleteProductos(identificador:string){
    this.dataProductos =  this.dataProductos.filter(element => element.identificador != identificador);
    this.impuestos_save = this.impuestos_save.filter(element => element.identificador != identificador);
   // this.impuestos_save = this.impuestos_save.filter(element => element.producto_identificador != identificador);
    this.recalcular();
  }

  confirmDeleteRecetas(identificador:string){
    this.dataReceta =  this.dataReceta.filter(element => element.identificador != identificador);
    this.impuestos_save = this.impuestos_save.filter(element => element.identificador != identificador);
    this.recalcular();
  }

  addTarifa(){
    this.tarifaVisible = true;
    //this.formTarifa.reset();
  }

  addProductos(){
    this.productoVisible = true;
    this.formProducto.reset();
    this.recalcular();
  }

  addAbonos(){
    this.abonoVisible = true;
  }

  submitTarifa(){ 
    this.recargarTablaTarifa();
    this.tarifaVisible = false;
    this.recalcular();
  }

  submitProducto(){
    this.recargarTablaProducto();
    this.productoVisible = false;
    this.recalcular();
  }

  submitReceta(){
    this.recetaVisible = false;
    this.recargarTablaReceta();
    this.recalcular(); 
  }

  recargarTablaReceta() {
    let receta = this.formReceta.get('receta_id')?.value ;
    let cantidad = this.formReceta.get('cantidad')?.value ;
    
    let identificador = 'receta'+this.generarIdAleatorio(); 
    let impuesto = 0;

    receta.impuestos.forEach(impuestoElement => {    
      let totalImpuesto = parseInt(impuestoElement.impuesto.porcentaje) * ( parseFloat(receta.precio ) * parseInt (cantidad) ) / 100;
      impuesto =  impuesto + totalImpuesto;
      
      this.impuestos_save.push({
        'valor' :  totalImpuesto,
        'porcentaje' : impuestoElement?.impuesto?.porcentaje,
        'cantidad': cantidad,
        'id': impuestoElement?.impuesto.id,
        'item_id': receta.id,
        'tipo': '4',
        'identificador': identificador,
     });

    }); 
    
    this.dataReceta.push(
      {
        nombre: receta.nombre,
        valor: receta.precio * cantidad,
        valorImpuesto: (receta.precio * cantidad) + impuesto,
        cantidad: cantidad,
        id: receta.id,
        identificador: identificador,
        impuestos: receta.impuestos
      }
    )
  }

  recargarTablaProducto(){ 
    let producto = this.formProducto.get('producto_id')?.value ;
    let cantidad = this.formProducto.get('cantidad').value; 

    let impuesto = 0;
    let tipo_producto = producto.tipo ;
    let identificador = 'productos'+this.generarIdAleatorio(); 

    producto.impuestos.forEach(impuestoElement => {   
      let totalImpuesto = parseInt(impuestoElement.impuesto.porcentaje) * ( parseFloat(producto.valor ) * parseInt (cantidad) ) / 100;
      impuesto =  impuesto + totalImpuesto;

      this.impuestos_save.push({
        'valor' :  totalImpuesto,
        'porcentaje' : impuestoElement.impuesto.porcentaje,
        'cantidad': cantidad,
        'id': impuestoElement.impuesto.id,
        'item_id': producto.id,
        'tipo': '1',
        'identificador': identificador,
      });
    });
 
    this.dataProductos.push({
      nombre: producto.nombre,
      valor: producto.valor * cantidad,
      valorImpuesto: (producto.valor * cantidad) + impuesto,
      cantidad: cantidad,
      tipoProducto: tipo_producto,
      id: producto.id,
      identificador: identificador,
    }) 

    this.formProducto.reset();
  }

  recargarTablaTarifa(){
    let tarifa = this.formTarifa.get('tarifa_id').value; 

    this.dataTarifa = [];
    this.allTarifasDefault = [];

    tarifa.forEach(element => {
     // let identificador = 'tarifas'+this.generarIdAleatorio();

        this.dataTarifa.push({
          valor: element.valor,
          nombre:element.nombre,
          tipo: element.tipo,
          id: element.id,
         // identificador: identificador,
        }); 

        this.allTarifasDefault.push(
          {
            valor: element.valor,
            nombre:element.nombre,
            tipo: element.tipo,
            id: element.id,
           // identificador: identificador,
          }
        );
    });

  }

  recargarTablaAbonos(){
    let metodoPago = this.formMetodoPago.get('metodo_pago_id').value[0];
    let valor = parseFloat(this.formMetodoPago.get('valor').value);

    this.dataAbonos.push({
      valor: valor,
      nombre: metodoPago.nombre,
      id: metodoPago.id,
      metodo_pago_id: metodoPago.id,
      identificador: 'abonos'+this.generarIdAleatorio(),
    })

  }

  submitAbono(){
    this.abonoVisible = false;
    this.recargarTablaAbonos();
    this.recalcular();
  }

  submitAll(){
    if(this.estadoHabitacion?.estado_id == 2){

      let guardar = {
        tarifas: this.dataTarifa,
        productos: this.dataProductos,
        abonos: this.dataAbonos,
        detalleId: this.detalleId,
        hotelId: this.hotelId,
        clienteId: this.clienteId, 
        receta: this.dataReceta,

      //  impuesto: this.impuestos_save,
        habitacion_id: this.habitacionId
      }
 
      this.envirRoomDetalle(guardar);
    }
  }

  envirRoomDetalle(data: any){
    this.spinner.show();

    this.dashboardRoomsService.saveDetalleHabitacion(data).subscribe(response => {
 
      this.spinner.hide();

      let data:any = response;

      if(data.code == "success"){
        Swal.fire({
          title: "Exito",
          text: data.msm ,
          icon: "success"
        });
         
        this.router.navigate(['dashboard/dashboardRooms']);

      } else  if(data.code == "warning"){
        
        Swal.fire({
          title: "Advertencia",
          text: data.msm,
          icon: "warning"
        });
        
      }  else {

        Swal.fire({
          title: "Error",
          text: "Error al anular.",
          icon: "error"
        });
      }
    }) 
  }

  envirRoomDetalleFactura(data: any){
    this.spinner.show();

    this.dashboardRoomsService.saveDetalleHabitacion(data).subscribe(response => {
 
      if(data.code == "warning"){
        Swal.fire({
          title: "Advertencia",
          text: data.msm,
          icon: "warning"
        });
      } else {

        let guardar = {
            detalle_id: this.detalleId,
            metodos_pagos: this.formFacturacionMediosPago.value,
            concepto: 'Factura Habitacion',
            hotel_id: this.hotelId,
            cliente_id: this.clienteId,
            porcentaje_descuento: 0,
            subtotal: this.subtotaltotalPagarReserva, 
            total: this.totalPagarReserva + this.abonosTotal, 
            impuesto_total: this.totalImpuestos, 
            detalleId: this.detalleId,
            hotelId: this.hotelId,
            clienteId: this.clienteId,
            receta: this.dataReceta,
            impuesto: this.impuestos_save, 
            habitacion_id: this.habitacionId
        }
       // console.log(guardar);
        this.enviarFacturacion(guardar);
      }
        
    }) 
  }

  desocuparHabitacion(){
    
    let parametros = {
      id_habitacion: this.habitacionId, 
    }; 

    Swal.fire({
      title: "¿Estas seguro que deseas desocupar esta habitacion?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) { 
          this.spinner.show();

            this.enviarDesocupar(parametros);
        }
    });

  }

  facturacion(){
    this.facturarVisible = true;
  }

  enviarDesocupar(parametros){
    this.dashboardRoomsService.desocupar(parametros).subscribe(
      (response: any) => {       
        let data = response;
        this.spinner.hide();

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Anulacion Exitosa.",
            icon: "success"
          });
          
          this.router.navigate(['dashboard/dashboardRooms']);

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }  else {
          Swal.fire({
            title: "Error",
            text: "Error al anular.",
            icon: "error"
          });
        }
      },
      (error) => {
          console.log('Error: ', error);
      }
    ); 
  }

  validaciones(){

    this.disableFactura = false;

    if(this.abonosTotal>this.tarifasTotal){
      this.disableFactura = true;
      this.cargarItems();
    }
  }

  eliminarMedioPagoAbono(index: number){
    this.formFacturacionMediosPago.removeAt(index); 
    this.changeMedioPagoFactura();
  }

  agregarAbonoOcupar(){
    let form =  this.FB.group({ 
      monto: ['', [Validators.required, Validators.min(1)]],
      medio_pago: [this.dataMetodosPago[0], [Validators.required, Validators.min(0)]],
    }); 

    this.formFacturacionMediosPago.push(
      form
    )
  }

  changeMedioPagoFactura(){
    this.totalFactura = 0;

    this.formFacturacionMediosPago.value.forEach(element => {
      this.totalFactura = this.totalFactura + parseFloat(element.monto)
    })   

  }

  submitFactura() { 

    let guardarRoom = {
      tarifas: this.dataTarifa,
      productos: this.dataProductos,
      abonos: this.dataAbonos,
      detalleId: this.detalleId,
      hotelId: this.hotelId,
      clienteId: this.clienteId, 
      receta: this.dataReceta, 
      impuesto: this.impuestos_save,
      habitacion_id: this.habitacionId
    }
   
    this.envirRoomDetalleFactura(guardarRoom); 
    

  }

 
  enviarFacturacion(parametros){
    this.spinner.show();

    this.dashboardRoomsService.facturar(parametros).subscribe(
      (response: any) => {       
        let data = response;
        this.facturarVisible = false;
        this.spinner.hide();

        if(data.code == "success"){

          Swal.fire({
            title: "Exito",
            text:  data.msm,
            icon: "success"
          });
          
          this.router.navigate(['dashboard/dashboardRooms']);

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.msm,
            icon: "warning"
          });
        }  else {
          Swal.fire({
            title: "Error",
            text: "Error al Facturar.",
            icon: "error"
          });
        }
      },
      (error) => {
          console.log('Error: ', error);
      }
    ); 
  }

  addRecetas(){
    this.recetaVisible = true;
  }

  generarIdAleatorio(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const longitud = 10;
    let id = '';
    for (let i = 0; i < longitud; i++) {
      id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return id;
  }
 
}
