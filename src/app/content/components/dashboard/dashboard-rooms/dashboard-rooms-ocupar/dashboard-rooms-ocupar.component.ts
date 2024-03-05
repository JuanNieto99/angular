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
  public formMetodoPago: FormGroup;  
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
  public detalleAbonoId: number;
  public totalProductos: number = 0;
  public dataProductos: any[] = [];
  public tarifaVisible: boolean = false;
  public productoVisible: boolean = false;
  public abonoVisible: boolean = false;
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

    this.formProducto  = this.FB.group({ 
      producto_id: [null, [Validators.required]],
      cantidad: [1, [Validators.required]],
    });


    this.formMetodoPago = this.FB.group({
      metodo_pago_id: [null, [Validators.required]],
      valor: [null, [Validators.required]],
    });

    let form =  this.FB.group({ 
      monto: ['', [Validators.required, Validators.min(0)]],
      medio_pago: [this.dataMetodosPago?this.dataMetodosPago[0]:null, [Validators.required, Validators.min(0)]],
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
      
        this.impuestos.forEach(element => {
            this.impuestosData.push(
              {
                id: element.id,
                nombre: element.nombre,
                porcentaje: element.porcentaje
              }
            )
        });

       // let identificador = 'tarifas'+this.generarIdAleatorio();
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

        this.dataMetodosPago = this.dataRoomDetail.metodos_pago;

        this.dataRoomDetail.productosHabitacion.forEach(element => {

          let impuesto = 0;   
          let identificador ='productos'+this.generarIdAleatorio()
          if(element.tipo == 1) { 
         
            this.impuestos.forEach(elementImpuesto => {
              impuesto = impuesto + ( (parseInt(element?.valor) * parseInt(element?.cantidad)) *  elementImpuesto?.porcentaje / 100);
             
              this.impuestos_save.push(
                {
                  id: elementImpuesto.id,
                  porcentaje: elementImpuesto?.porcentaje,
                  valor: impuesto,
                  producto_identificador: identificador,
                  item_id: element.productos.id,
                }
              )
            
            });   

            
             
            impuesto =  parseInt((parseInt(element?.valor) * parseInt(element?.cantidad)) + (impuesto) + '');
         
          }
          
          this.totalImpuestos = impuesto -  element?.valor;
          
          this.dataProductos.push({
                nombre: element?.productos.nombre,
                valor: element?.valor,
                valorImpuesto: impuesto,
                cantidad: element?.cantidad,
                id: element?.item_id,
                identificador: identificador,
                tipoProducto: element?.productos.tipo_producto,
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
              tipo: element.tipo_producto
            })
        })

        this.detalleId = this.dataRoomDetail?.detalleHabitacion.id;
        this.hotelId = this.dataRoomDetail?.detalleHabitacion.hotel_id;
        this.clienteId = this.dataRoomDetail?.detalleHabitacion.cliente?.id;
    
        
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

    this.dataTarifa.forEach(element => {
        this.tarifasTotal = this.tarifasTotal + parseFloat( element.valor ) ; 
    });

    let productoTotal = 0;
    
    this.dataProductos.forEach(element => {
      let valor = 0;
      if(element?.valorImpuesto==0) {
        valor = parseFloat(element?.valor)
      } else {
        valor = element?.valorImpuesto
        this.totalImpuestos = element?.valorImpuesto - element?.valor;
      } 

      this.totalProductos = this.totalProductos + valor  ;
    });
     
  
    

    this.dataAbonos.forEach(element => {
      this.abonosTotal = this.abonosTotal + parseFloat( element.valor ) ;
    }); 

    this.totalPagarReserva = (this.tarifasTotal +  this.totalProductos ) ;
 
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
  }

  confirmDeleteProductos(identificador:string){
    this.dataProductos =  this.dataProductos.filter(element => element.identificador != identificador);
    this.impuestos_save = this.impuestos_save.filter(element => element.producto_identificador != identificador);
    this.recalcular();
  }

  addTarifa(){
    this.tarifaVisible = true;
  }

  addProductos(){
    this.productoVisible = true;
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

  recargarTablaProducto(){
    let producto = this.formProducto.get('producto_id').value[0];
    let cantidad = this.formProducto.get('cantidad').value;
 
    let impuesto = 0;
    let tipo_producto = producto.tipo ;
    let identificador = 'productos'+this.generarIdAleatorio()
    if( tipo_producto == 1) {

      this.impuestos.forEach(elementImpuesto => {
        impuesto = impuesto + ( (producto.valor * cantidad) *  elementImpuesto?.porcentaje / 100);
        this.impuestos_save.push(
          {
            id: elementImpuesto.id,
            porcentaje: elementImpuesto?.porcentaje,
            valor: impuesto,
            producto_identificador: identificador,
            item_id: producto.id,
          }
        )
      });   
      
      impuesto =  parseInt((parseInt(producto.valor) * parseInt(cantidad)) + (impuesto) + '');
    }  
  
    this.dataProductos.push({
      nombre: producto.nombre,
      valor: producto.valor * cantidad,
      valorImpuesto: impuesto,
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

    

      /*  this.allTarifasDefault.push(
          {
            valor: element.valor,
            nombre:element.nombre,
            tipo: element.tipo,
            id:element.id,
            identificador: identificador,
          }
        );*/
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
        impuesto: this.impuestos_save,
        habitacion_id: this.habitacionId
      }
 
      this.envirRoomDetalle(guardar);
    }
  }

  envirRoomDetalle(data: any){
    this.spinner.show();

    this.dashboardRoomsService.saveDetalleHabitacion(data).subscribe(response => {
      console.log(response)
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
            subtotal: this.totalPagarReserva,
            total: this.totalPagarReserva - this.abonosTotal,
            impuesto_total: this.totalImpuestos, 
            detalleId: this.detalleId,
            hotelId: this.hotelId,
            clienteId: this.clienteId,
            impuesto: this.impuestos_save,
            habitacion_id: this.habitacionId
        }

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

    console.log(this.totalFactura)
    console.log(this.totalPagarReserva-this.abonosTotal)

  }

  submitFactura() { 

    let guardarRoom = {
      tarifas: this.dataTarifa,
      productos: this.dataProductos,
      abonos: this.dataAbonos,
      detalleId: this.detalleId,
      hotelId: this.hotelId,
      clienteId: this.clienteId,
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
