import { Component, OnInit, ViewChild } from '@angular/core';
import { dashboardRooms } from 'src/app/content/models/dashboard/dashboard-rooms.model';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import {  MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';  
import { MultiSelectModule } from 'primeng/multiselect';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

interface HotelData {
  hotel_id: number; // Adjust the type accordingly
  piso_id: number; 
}

interface dataRoomPiso {
  piso:number,
  habitaciones: dataRoom[],
  loading: boolean,
}

interface dataRoom {
  nombre: string,
  json: string,
  id: number,
  detalle: any;
  tipoHabitacion: any;
  habitacionNombre: any;
}

interface dataProducto {
  nombre: string, 
  id: number, 
}

interface dataMedioPago {
  nombre: string, 
  id: number, 
}
@Component({
  selector: 'app-dashboard-rooms',
  templateUrl: './dashboard-rooms.component.html',
  styleUrls: ['./dashboard-rooms.component.scss']
})

export class DashboardRoomsComponent implements OnInit  {
  @ViewChild('op1') op1: OverlayPanel;

  public menuHabitacion: MenuItem [];
  public totalPagarReserva: number = 48.100;
  public fechaInicio: any;
  public fechaFinal: any;
  public fechaInicioLimpieza: any;
  public fechaFinalLimpieza: any;
  public fechaInicioMantenimiento: any;
  public fechaFinalMantenimiento: any;
  public selectedMulti: any[] = [];
  public nombreHabitacionReservada: string;
  private hotelId: number;
  private pisoId: number;
  private primerPiso: number = 1; 
  public dataRoomsPisos: any[];
  public htmlContent: string;
  public dataRoom: dataRoomPiso [] = [];
  private estadoHabitacion: number;
  private habitacionId: number;
  public reservacionModalVisible: boolean = false;
  public formReservacion: FormGroup;  
  public formLimpieza: FormGroup;  
  public formMantenimiento: FormGroup;  

  public formReservacionArray: FormArray ;  
  public formOcuparArray: FormArray ;  

  public clienteData: any;
  public ProductoServicioData: any; 
  public ProductoServicio: any; 
  public ProductoServicioDataSeleccionados: dataProducto [] =[] ; 
  public selectMedioPago: dataMedioPago [] =[] ;
  public metodosPago: any;
  public empleadosData: any;
  public visibleModalLimpieza: boolean = false;
  public visibleModalMantenimiento: boolean = false;
  public ocuparModalVisible: boolean = false;

  ngOnInit(): void {
    this.buildForm();

    this.pisoId = 1; 
    this.primerPiso = this.pisoId;
    let currentUser:any = JSON.parse(localStorage.getItem('currentUser'));  
    this.hotelId = currentUser.usuario.datalle_hoteles[0].hotel_id;
    this.getRoomsDashboardPisos();
    this.clienteData = [];
    this.ProductoServicioData = [];
    this.empleadosData = [];
  
  }

  constructor( 
    private dashboardRoomsService:DashboardRoomsService, 
    private FB: FormBuilder,
    private spinner: NgxSpinnerService
  ){
    this.formReservacionArray = this.FB.array([]); 
    this.formOcuparArray = this.FB.array([]); 
  }

  buildForm(){ 

    this.formLimpieza = this.FB.group({
      descripcion: ['',[Validators.required]],
    });


    this.formMantenimiento = this.FB.group({
      descripcion: ['',[Validators.required]],
    });
    

    this.formReservacion =  this.FB.group({
      habitacion_id: ['',[Validators.required]],
      hotel_id: ['',[Validators.required]],
      cliente_id: ['',[Validators.required]],
      fecha_inicio: ['',[Validators.required]],
      fecha_final: ['',[Validators.required]],
    }); 


  }

  agregarAbono(){
    let form =  this.FB.group({ 
      monto: ['', [Validators.required, Validators.min(0)]],
      medio_pago: ['', [Validators.required, Validators.min(0)]],
    }); 

    this.formReservacionArray.push(
      form
    )

  }

  agregarAbonoOcupar(){

    let form =  this.FB.group({ 
      monto: ['', [Validators.required, Validators.min(0)]],
      medio_pago: ['', [Validators.required, Validators.min(0)]],
    }); 

    this.formOcuparArray.push(
      form
    )
  }

  getRoomsDashboard(){
    let data : HotelData = {
      hotel_id: this.hotelId,
      piso_id: this.pisoId
    }; 

    this.dashboardRoomsService.getDashboardRooms(data).subscribe(
        (response: any) => {
          
          this.dataRoom.forEach(element => {
            if(this.pisoId == element.piso){
              element.habitaciones = [];
            }
          }); 
          
          let pisoEncontrado = this.dataRoom.find(piso => piso.piso == this.pisoId);
            pisoEncontrado.loading = false;
            response.forEach(habitaciones => {  
                pisoEncontrado.habitaciones.push
                (
                  { 
                      nombre: habitaciones.nombre,
                      json: habitaciones.diseno_json,
                      id: habitaciones.id,
                      detalle: habitaciones.habitacion_estado,
                      tipoHabitacion: habitaciones.tipo_habitacion,
                      habitacionNombre: JSON.parse(habitaciones.tipo_habitacion.diseno_json)['puerta'] ,
                  }
                )
            });

            this.dataRoom.forEach(element => {
              if(this.pisoId == element.piso){
                element = pisoEncontrado;
              }
            });
          
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
  }

  getRoomsDashboardPisos(){ 
    let data : HotelData = {
      hotel_id: this.hotelId,
      piso_id: this.pisoId
    }; 

    this.dashboardRoomsService.getPisos(data).subscribe(
        (response: any) => {       
          this.dataRoomsPisos = response.pisos;
          this.dataRoomsPisos.forEach(element => {
  
            this.dataRoom.push(
              {
                piso: element.piso,
                habitaciones: [],
                loading: true,
              }
            ) 

          }); 

          this.getRoomsDashboard(); 
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
  }

  openTag(piso){   
    this.pisoId = piso; 
    this.getRoomsDashboard();   
  }

  opcionesHabitacion(habitacion){ 
   
    
  }

  opcionSeleccionada($event, habitacion){
    this.estadoHabitacion = $event.item.id;
    this.formReservacionArray = this.FB.array([]); 
    this.formOcuparArray = this.FB.array([]); 

    setTimeout(() => {
      this.accionMenuHabitaciones();
    }, 500); 
    
  }


  accionMenuHabitaciones(){
    let parametros  = {};  
    
    if(this.estadoHabitacion == 5){
      //reserva
      this.reservar();
    } else if(this.estadoHabitacion == 4) {
        //Limpieza
        parametros = {
          id_habitacion: this.habitacionId, 
          estado: this.estadoHabitacion,
          hotel_id: this.hotelId,
        }; 

        this.getDataEmpleado(parametros);
      //  this.limpieza(parametros);
    }  else if(this.estadoHabitacion == 6) {
        //Mantenimiento
        parametros = {
          id_habitacion: this.habitacionId, 
          estado: this.estadoHabitacion,
          hotel_id: this.hotelId,
        }; 

        this.getDataEmpleado(parametros);
        //this.enviarMantenimiento(parametros);
    } else if(this.estadoHabitacion == 2) {
      //Ocupar
      this.ocupar()
    } else if(this.estadoHabitacion == 20) {
        //Desocupar
        parametros = {
          id_habitacion: this.habitacionId,
          id_detalle: 1,
        }; 
        this.enviarDesocupar(parametros);
    } else if(this.estadoHabitacion == 50) {
        //anular resrva 

        parametros = {
          id_habitacion: this.habitacionId,
          id_reserva: 1,
        }; 

        this.enviarAnularReserva(parametros);
    } else if(this.estadoHabitacion == 40) { 
      
      parametros = {
        id_habitacion: this.habitacionId, 
      }; 

      this.enviarAnularLimpieza(parametros);
    } else if(this.estadoHabitacion == 60) { 
        //anular Mantenimiento 

        parametros = {
          id_habitacion: this.habitacionId, 
        }; 

        this.enviarAnularMantenimiento(parametros);
    } else {
      console.log("Ninguno")
    }
    
  }

  abrirMenu($event, habitacion){
    this.op1.toggle($event)  
    console.log(habitacion)
    let estadoHabitaciones = [];
    this.habitacionId = habitacion.id;
    this.nombreHabitacionReservada = habitacion.nombre;
    
    let letItem: MenuItem[] = [];  // Corrected the declaration and initialization
    
    if(habitacion.detalle){
      habitacion.detalle.forEach(element => {
        estadoHabitaciones.push(element.estado_id);
      }); 
    }

    if(!estadoHabitaciones.includes(5)){ //no esta reservada entonces reservemosla
      letItem.push(
      {
        label: 'Reservar',
        icon: 'pi pi-calendar-times',
        id: '5',
        command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
        visible: true,
        disabled: !estadoHabitaciones.includes(2)?false:true,
      }) 
    }
  
    if(!estadoHabitaciones.includes(4)){ //no esta en limpieza
      letItem.push(
        {
          label: 'Limpieza',
          icon: 'pi pi-exclamation-triangle',
          id: '4',
          command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
          visible: true,
          disabled: !estadoHabitaciones.includes(2)?false:true,
        },
      )
      
    }

    if(!estadoHabitaciones.includes(2)){ //no ocupado
      letItem.push(
        {
          label: 'Ocupar',
          icon: 'pi pi-lock',
          id: '2',
          command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
          visible: true,
          disabled: !estadoHabitaciones.includes(5)/* 5-6-4 */ ?false:true,
        },
      )
      
    }

    if(!estadoHabitaciones.includes(6)){ //no esta en mantenimiento
      
      letItem.push(
        {
          label: 'Mantenimiento',
          icon: 'pi pi-wrench',
          id: '6',
          command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
          visible: true,
          disabled: !estadoHabitaciones.includes(2)?false:true,

        }, 
      )
      
    }


    estadoHabitaciones.forEach(element => { 
      switch (element) {
        case 5:
          //esta reservada
          letItem.push(
            { 
              label: 'Anular Reserva',
              icon: 'pi pi-calendar-times',
              id: '50',
              command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
              visible: true,
              disabled: !estadoHabitaciones.includes(2)?false:true,
            } 
          )
          
          break;
        case 4:
          //esta limpieza 

          letItem.push(
            { 
              label: 'Anular Limpieza',
              icon: 'pi pi-exclamation-triangle',
              id: '40',
              command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
              visible: true,
              disabled: !estadoHabitaciones.includes(2)?false:true,
            }
          )
      

        break;
        case 6:
          //esta mantenimiento 
          
          letItem.push(
            { 
              label: 'Anular Mantenimiento',
              icon: 'pi pi-wrench',
              id: '6',
              command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
              visible: true,
              disabled: !estadoHabitaciones.includes(2)?false:true,
            }
          )

        break;

        case 2:
          //esta ocupado 

          letItem.push(
            { 
                label: 'Desocupar',
                icon: 'pi pi-lock-open',
                id: '20',
                command: (event: MenuItemCommandEvent) => this.opcionSeleccionada(event, habitacion),
                visible: true,
                
            }
          )
          
        break;
      }
  
    });

    this.menuHabitacion = 
    [
      {
        label: 'Opciones',
        items: letItem
      }
    ]
    
  }

  reservar(){
    
    this.getReserva();
    this.getProducto();
    //sacar modal
  }

  enviarReservar(parametros){  

    this.dashboardRoomsService.reservar(parametros).subscribe(
      (response: any) => {       
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
    
  }

  reservarSubmit(){
  
  }

  enviarDesocupar(parametros){

    this.dashboardRoomsService.desocupar(parametros).subscribe(
      (response: any) => {       
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    ); 
  } 

      
  enviarAnularReserva(parametros){

    this.dashboardRoomsService.desocupar(parametros).subscribe(
      (response: any) => {       
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  enviarAnularLimpieza(parametros){

    this.dashboardRoomsService.desocupar(parametros).subscribe(
      (response: any) => {       
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  enviarAnularMantenimiento(parametros){

    this.dashboardRoomsService.anularMantenimiento(parametros).subscribe(
      (response: any) => {       
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  enviarMantenimiento(parametros){

    this.dashboardRoomsService.mantenimiento(parametros).subscribe(
      (response: any) => {       
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  enviarOcupar(parametros){

    this.dashboardRoomsService.mantenimiento(parametros).subscribe(
      (response: any) => {       
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  limpieza(parametros){
    this.dashboardRoomsService.limpieza(parametros).subscribe(
      (response: any) => {   
            
        let data = response;

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  ocupar(){ 
    //sacar modal 
    let parametros = {
      id_habitacion: this.habitacionId,
      cliente_id: 1,
      hotel_id: 1,
    }; 

        
    this.getReserva();
    this.getProducto();

   // this.enviarOcupar(parametros);
  }


  getReserva(clienteBusqueda:string =''){
    this.spinner.show();  
    let data = {
      'hotel_id':this.hotelId,
      'cliente_busqueda': clienteBusqueda,
    };

    this.dashboardRoomsService.getReserva(data).subscribe(
      (response: any) => {   
        this.spinner.hide();  
        
        if(this.estadoHabitacion == 5){
          this.reservacionModalVisible = true; 
        }

        if(this.estadoHabitacion == 2){
          this.ocuparModalVisible = true;  
        }
        let dataCliente = response.cliente;
        let dataMedioPago = response.metodos_pago;
        this.clienteData = [];
        dataCliente.forEach(element => {
          this.clienteData.push({
            name: element.numero_documento +' '+element.nombres +' '+ element.apellidos ,
            code: element.numero_documento
          }) 
        });

        this.selectMedioPago = [];
        dataMedioPago.forEach(element => {
          this.selectMedioPago.push({
            nombre: element.nombre,
            id: element.id
          }) 
        });
      },
      (error) => {
        this.spinner.hide();
          console.log('Error: ', error);
      }
    );
  }

  busquedaCliente($event){
    let clienteBusqueda = $event.filter; 
    this.getReserva(clienteBusqueda);
  } 

  getProducto(productoBusqueda: string = '') {
    this.spinner.show();  
    let data = {
      'hotel_id':this.hotelId,
      'producto_busqueda': productoBusqueda,
    };

    this.dashboardRoomsService.getProductoServicio(data).subscribe(
      (response: any) => {   
        this.spinner.hide();   
        let data = response.productos;
        this.ProductoServicioData = [];
        console.log(data)
        data.forEach(element => {  
          this.ProductoServicioData.push({
            name: element.nombre,
            code: element.id
          }) 
        });
        this.ProductoServicio = this.ProductoServicioData;
      },
      (error) => {
        this.spinner.hide();
          console.log('Error: ', error);
      }
    );
  }

  submitAsignarLimpieza(){

  }

  eliminarMedioPago(index: number){
    this.formReservacionArray.removeAt(index); 
  }

  eliminarMedioPagoAbono(index: number){
    this.formOcuparArray.removeAt(index); 
  }


  getDataEmpleado(parametros: any){
    this.spinner.show();   

    this.dashboardRoomsService.getEmpleadoHabitacion(parametros).subscribe(
      (response: any) => {   
        this.spinner.hide();   
        this.empleadosData = [];
        response.empleados.forEach(element => {  
          this.empleadosData.push({
            name: element.nombres +' '+element.apellidos,
            code: element.id
          }) 
        });

        if(parametros.estado == 4){
          this.visibleModalLimpieza = true; 
        } else if(parametros.estado == 6){
          this.visibleModalMantenimiento = true; 
        }
          
      },
      (error) => {
        this.spinner.hide();
          console.log('Error: ', error);
      }
    );

  }

  submitAsignarMantenimiento(){

  }
}
