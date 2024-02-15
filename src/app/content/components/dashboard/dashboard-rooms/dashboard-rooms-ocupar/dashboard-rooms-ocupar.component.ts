import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';

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

  constructor( 
    private dashboardRoomsService:DashboardRoomsService, 
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
  ){ 
  }

  ngOnInit(){
    this.spinner.hide();
    this.dataRoomDetail = [];
    this.habitacionId = parseFloat(this.route.snapshot.paramMap.get('idHabitacion'));  
    this.buildForm();
    this.getRoomOcupar();
 
    this.items = [
      { label: 'Facturar', icon: 'pi pi-dollar' , command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'facturar') },
      { label: 'Desocupar', icon: 'pi pi-lock-open', command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'desocupar') }
    ];
  } 
  buildForm(){
    this.form = this.FB.group({
      nombreHabitacion: [this.dataRoomDetail?.detalleHabitacion?.habitacion?.nombre, []],
      descripcion: ['', []],
      nombreCliente: [this.dataRoomDetail?.detalleHabitacion?.cliente?.nombres+' '+this.dataRoomDetail?.detalleHabitacion?.cliente?.apellidos, []],
      desde: [this.dataRoomDetail?.detalleHabitacion?.checkin, []],
      hasta: [this.dataRoomDetail?.detalleHabitacion?.descripcion, []],
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

        let identificador = 'tarifas'+this.generarIdAleatorio();
        this.allTarifasDefault = [];
        this.dataRoomDetail.tarifasHabitacion.forEach(element => {

          this.dataTarifa.push({
            valor: element.valor,
            nombre: element.tarifa.nombre,
            tipo: element.tipo,
            id:element.id,
            identificador: identificador,
          }); 

        });


        this.dataMetodosPago = this.dataRoomDetail.metodos_pago;

        this.dataRoomDetail.productosHabitacion.forEach(element => {

          this.dataProductos.push({
                nombre: element?.productos.nombre,
                valor: element?.valor,
                cantidad: element?.cantidad,
                id: element?.id,
                identificador: 'productos'+this.generarIdAleatorio(),
            });
        });

        this.dataRoomDetail.abonoHabitacion.forEach(element => {
          this.dataAbonos.push(
            {
              valor: element.valor,
              nombre: element.metodo_pago.nombre,
              id: element.id,
              identificador: 'productos'+this.generarIdAleatorio(),
            }
          ); 
        });


        this.dataRoomDetail.tarifas.forEach(element => {
          let identificador =  'tarifas'+this.generarIdAleatorio();
          this.allTarifas.push(
              {
                valor: element.valor,
                nombre: element.nombre,
                tipo: element.tipo,
                id:element.id,
                identificador: identificador,
              }
          ); 

          if(this.dataRoomDetail.tarifasHabitacion.filter(elementFilter => (elementFilter.tarifa.id==element.id)).length>0){
            this.allTarifasDefault.push({
              valor: element.valor,          
              nombre: element.nombre,
              tipo: element.tipo,
              id:element.id,
              identificador: identificador,
            });
          } 

        }); 

        this.dataRoomDetail.productos.forEach(element => {
          this.productoData.push(
            {
              id: element.id,
              nombre: element.nombre,
              valor: element.precio,  
            })
        })
        
        this.buildForm();
        this.recalcular();
      })
  }

  recalcular(){

    this.tarifasTotal = 0;
    this.totalProductos = 0;
    this.abonosTotal = 0;
    this.totalPagarReserva = 0;

    this.dataTarifa.forEach(element => {
        this.tarifasTotal = this.tarifasTotal + parseFloat( element.valor ) ; 
    });

    this.dataProductos.forEach(element => {
      this.totalProductos = this.totalProductos + (parseFloat( element?.valor ) * parseFloat( element?.cantidad ) ) ;
    });

    this.dataAbonos.forEach(element => {
      this.abonosTotal = this.abonosTotal + parseFloat( element.valor ) ;
    });

    this.totalPagarReserva = (this.tarifasTotal +  this.totalProductos );

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
    console.log(opcion)
  }


  confirmDeleteAbono(identificador:string){
    this.dataAbonos =  this.dataAbonos.filter(element => element.identificador != identificador);
    this.recalcular();
  }

  confirmDeleteTarida(identificador:string){
    this.dataTarifa =  this.dataTarifa.filter(element => element.identificador != identificador);
    this.formTarifa.reset();  
    //this.formTarifa.get('tarifa_id').setValue( this.dataTarifa );
    this.recalcular();
  }

  confirmDeleteProductos(identificador:string){
    this.dataProductos =  this.dataProductos.filter(element => element.identificador != identificador);
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

    this.dataProductos.push({
      nombre: producto.nombre,
      valor: producto.valor,
      cantidad: cantidad,
      id: producto.id,
      identificador: 'productos'+this.generarIdAleatorio(),
    })

    this.formProducto.reset();
  }

  recargarTablaTarifa(){
    let tarifa = this.formTarifa.get('tarifa_id').value; 

    this.dataTarifa = [];
    this.allTarifasDefault = [];

    tarifa.forEach(element => {
      let identificador = 'tarifas'+this.generarIdAleatorio();

        this.dataTarifa.push({
          valor: element.valor,
          nombre:element.nombre,
          tipo: element.tipo,
          id:element.id,
          identificador: identificador,
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

    this.allTarifasDefault = this.dataTarifa; 
  }

  recargarTablaAbonos(){
    let metodoPago = this.formMetodoPago.get('metodo_pago_id').value[0];
    let valor = parseFloat(this.formMetodoPago.get('valor').value);

    this.dataAbonos.push({
      valor: valor,
      nombre: metodoPago.nombre,
      id: metodoPago.id,
    })

  }

  submitAbono(){
    this.abonoVisible = false;
    this.recargarTablaAbonos();
    this.recalcular();
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
