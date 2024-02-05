import { Component, OnInit, ViewChild } from '@angular/core';
import { dashboardRooms } from 'src/app/content/models/dashboard/dashboard-rooms.model';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import {  MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';  
import { MultiSelect } from 'primeng/multiselect';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'; 
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { InputTextarea } from 'primeng/inputtextarea';
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
  piso: number,
  habitacionEstado: any,
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
  @ViewChild('clienteMultiSelectReservar') clienteMultiSelectReservar: MultiSelect;
  @ViewChild('clienteMultiSelectTarifa') clienteMultiSelectTarifa: MultiSelect;
  @ViewChild('clienteMultiSelectProducto') clienteMultiSelectProducto: MultiSelect;
  @ViewChild('clienteMultiSelectOcupar') clienteMultiSelectOcupar: MultiSelect;
  @ViewChild('tarifaMultiSelectOcupar') tarifaMultiSelectOcupar: MultiSelect;
  @ViewChild('productoMultiSelectOcupar') productoMultiSelectOcupar: MultiSelect; 

  public menuHabitacion: MenuItem [];
  public totalPagarReserva: number = 0;
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
  private pisoSeleccionado: number = 1; 
  public dataRoomsPisos: any[];
  public htmlContent: string;
  public dataRoom: dataRoomPiso [] = [];
  private estadoHabitacion: number;
  private habitacionId: number;
  public reservacionModalVisible: boolean = false;
  public formReservacion: FormGroup;  
  public formOcupar: FormGroup;  
  public formLimpieza: FormGroup;  
  public formMantenimiento: FormGroup;  
  public formReserva: FormGroup;  
  public formReservacionArray: FormArray ;  
  public formOcuparArray: FormArray ;  

  public clienteData: any;
  public ProductoServicioData: any; 
  public tarifaData: any;  
  public ProductoServicioDataSeleccionados: dataProducto [] =[] ; 
  public selectMedioPago: dataMedioPago [] =[] ;
  public metodosPago: any;
  public empleadosData: any;
  public visibleModalLimpieza: boolean = false;
  public visibleModalMantenimiento: boolean = false;
  public ocuparModalVisible: boolean = false;
  private tipoHabitacionId: number;
  public tarifasAgregadasReserva: any[] =[] ;
  public productosAgregadosReserva: any[] =[] ;
  public tarifasAgregadasOcupar: any[] =[] ;
  public productosAgregadosOcupar: any[] =[] ;
  public tarifasTotal = 0;
  public productosTotal = 0; 
  public abonosTotal = 0; 
  public tarifasTotalOcupar = 0;
  public productosTotalOcupar = 0; 
  public abonosTotalOcupar = 0; 
  public totalPagarOcupar = 0; 
  public disableReserva: boolean = false;
  public disableOcupar: boolean = false;
  public descripcionReserva: string;
  public hoy: Date;
  public disableButtonMantenimiento: boolean = false;
  public disableButtonLimpieza: boolean = false;
  public estadoHabitacionActual: any;

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
    this.tarifaData = [];
    this.hoy = new Date();
  }

  constructor( 
    private dashboardRoomsService:DashboardRoomsService, 
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
  ){
    this.formReservacionArray = this.FB.array([]); 
    this.formOcuparArray = this.FB.array([]); 
  }

  buildForm(){ 

    this.formLimpieza = this.FB.group({
      descripcion: ['',[Validators.required]],
      empleado: ['',[Validators.required]],
      fechaInicio: ['',[Validators.required]],
      fechaFinal: ['',[Validators.required]],
    });


    this.formMantenimiento = this.FB.group({
      descripcion: ['',[Validators.required]],
      empleado: ['',[Validators.required]],
      fechaInicio: ['',[Validators.required]],
      fechaFinal: ['',[Validators.required]],
    });
    

    this.formReservacion =  this.FB.group({
      habitacion_id: ['',[Validators.required]],
      hotel_id: ['',[Validators.required]],
      cliente_id: ['',[Validators.required]],
      fecha_inicio: ['',[Validators.required]],
      fecha_final: ['',[Validators.required]],
    }); 


    this.formReserva =  this.FB.group({
      descripcionReserva: ['', Validators.required]
    });

    this.formOcupar =  this.FB.group({
      descripcionReserva: ['', Validators.required]
    });

  }

  agregarAbono(){ 

    let form =  this.FB.group({ 
      monto: ['', [Validators.required, Validators.min(0)]],
      medio_pago: [this.selectMedioPago[0], [Validators.required, Validators.min(0)]],
    }); 

    this.formReservacionArray.push(
      form
    )

  }

  agregarAbonoOcupar(){
    let form =  this.FB.group({ 
      monto: ['', [Validators.required, Validators.min(0)]],
      medio_pago: [this.selectMedioPago[0], [Validators.required, Validators.min(0)]],
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
                      piso: habitaciones.piso,
                      habitacionEstado: habitaciones.habitacion_estado,
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
          this.dataRoomsPisos = [];
  
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

      
    }  else if(this.estadoHabitacion == 6) {
        //Mantenimiento
        parametros = {
          id_habitacion: this.habitacionId, 
        }; 

        Swal.fire({
          title: "¿Estas seguro que deseas Anular el mantenimiento?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Confirmar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) { 
                this.enviarAnularMantenimiento(parametros);
            }
        });
        //this.enviarMantenimiento(parametros);
    } else if(this.estadoHabitacion == 2) {
      this.ocupar();
    } else if(this.estadoHabitacion == 20) {
        //Limpieza
        parametros = {
          id_habitacion: this.habitacionId, 
        }; 

        Swal.fire({
          title: "¿Estas seguro que deseas desocupar?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Confirmar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) { 
                this.enviarDesocupar(parametros);
            }
        });

    } else if(this.estadoHabitacion == 50) {
      parametros = {
        id_habitacion: this.habitacionId, 
      }; 

      Swal.fire({
        title: "¿Estas seguro que deseas Anular la reserva?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Confirmar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
          if (result.isConfirmed) { 
              this.enviarAnularReserva(parametros);
          }
      });

    } else if(this.estadoHabitacion == 40) { 
        //Limpieza
        parametros = {
          id_habitacion: this.habitacionId, 
        }; 

        Swal.fire({
          title: "¿Estas seguro que deseas Anular La limpieza?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Confirmar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) { 
                this.enviarAnularLimpieza(parametros);
            }
        });
    } else if(this.estadoHabitacion == 60) { 

      console.log("LOL")

    } else {
      console.log("Ninguno")
    }
    
  }

  abrirMenu($event, habitacion){
    this.op1.toggle($event)    
    let estadoHabitaciones = [];
    this.habitacionId = habitacion.id;
    this.nombreHabitacionReservada = habitacion.nombre;
    this.tipoHabitacionId = habitacion.tipoHabitacion.id;
    this.pisoSeleccionado = habitacion.piso; 
    this.estadoHabitacionActual =  habitacion.habitacionEstado; 

    this.estadoHabitacionActual.forEach(element => {
        console.log(element.estado_id)
    });

    let letItem: MenuItem[] = [];  // Corrected the declaration and initialization
    


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
      let habilitar_desocupado_por_reservado = false;
     /* if(habitacion.detalle){
        habitacion.detalle.forEach(element => {
            if(element.estado_id == 5 ){

              let fecha_inicio = new Date(element.fecha_inicio);
              let fecha_actual = new Date(fecha_inicio.getFullYear(), fecha_inicio.getMonth(), fecha_inicio.getDate());              
              let hoydate = new Date(); // Obtiene la fecha y hora actual
              hoydate.setHours(0, 0, 0, 0); // Establece la hora, minutos, segundos y milisegundos a cero

              let hoy = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
          
            
            if(hoy == fecha_actual){
                habilitar_desocupado_por_reservado = true;
              } 
            }
        }); 
      }
      
      console.log(habilitar_desocupado_por_reservado)*/

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
    //this.getProducto();
    //sacar modal
  }

  enviarReservar(parametros){  

    this.dashboardRoomsService.reservar(parametros).subscribe(
      (response: any) => {       
        let data = response;
        this.reservacionModalVisible = false;
        if(data.code == "success"){

          Swal.fire({
            title: "Exito",
            text: "Reservacion exitosa.",
            icon: "success"
          });
          
          this.openTag(this.pisoSeleccionado)

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }   else {
          Swal.fire({
            title: "Error",
            text: "Error al generar la reserva.",
            icon: "error"
          });
        }
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

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Anulacion Exitosa.",
            icon: "success"
          });
          
          this.openTag(this.pisoSeleccionado)

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

      
  enviarAnularReserva(parametros){

    this.dashboardRoomsService.anularReserva(parametros).subscribe(
      (response: any) => {       
        let data = response;

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Anulacion Exitosa.",
            icon: "success"
          });
          
          this.openTag(this.pisoSeleccionado)

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }   else {
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

  enviarAnularLimpieza(parametros){

    this.dashboardRoomsService.anularLimpieza(parametros).subscribe(
      (response: any) => {       
        let data = response;

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Anulacion Exitosa.",
            icon: "success"
          });
          
          this.openTag(this.pisoSeleccionado)

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }   else {
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

  enviarAnularMantenimiento(parametros){

    this.spinner.show();

    this.dashboardRoomsService.anularMantenimiento(parametros).subscribe(
      (response: any) => {     
        this.spinner.hide();

        let data = response; 

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Anulacion Exitosa.",
            icon: "success"
          });
          
          this.openTag(this.pisoSeleccionado)

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }   else {
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

  enviarMantenimiento(parametros){
    this.spinner.show();
    this.dashboardRoomsService.mantenimiento(parametros).subscribe(
      (response: any) => {      
        this.spinner.hide();

        this.visibleModalMantenimiento = false;
        let data = response; 

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Registro exitoso.",
            icon: "success"
          });
          
          this.openTag(this.pisoSeleccionado)

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }   else {
          Swal.fire({
            title: "Error",
            text: "Error al registrar.",
            icon: "error"
          });
        }
      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  enviarOcupar(parametros){
    this.spinner.show();

    this.dashboardRoomsService.ocupar(parametros).subscribe(
      (response: any) => {    
        this.spinner.hide();   
        let data = response;
        this.ocuparModalVisible = false;
        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Ocupacion exitosa.",
            icon: "success"
          });
          
            
          this.openTag(this.pisoSeleccionado)

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }   else {
          Swal.fire({
            title: "Error",
            text: "Error al generar la ocupacion.",
            icon: "error"
          });
        }

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  enviarLimpieza(parametros){
    this.spinner.show();

    this.dashboardRoomsService.limpieza(parametros).subscribe(
      (response: any) => {   
        this.spinner.hide();

        let data = response;
        this.visibleModalLimpieza = false;

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Registro exitoso.",
            icon: "success"
          });
          
          this.openTag(this.pisoSeleccionado)

        } else  if(data.code == "warning"){
          Swal.fire({
            title: "Advertencia",
            text: data.error,
            icon: "warning"
          });
        }   else {
          Swal.fire({
            title: "Error",
            text: "Error al registrar.",
            icon: "error"
          });
        }

      },
      (error) => {
          console.log('Error: ', error);
      }
    );
  
  } 

  ocupar(){ 
    this.getReserva();  
  }


  getReserva(clienteBusqueda:string =''){
    this.spinner.show();  
    let data = {
      'hotel_id':this.hotelId,
      'cliente_busqueda': clienteBusqueda,
      'tipo_habitacion': this.tipoHabitacionId,
    };

    this.dashboardRoomsService.getReserva(data).subscribe(
      (response: any) => {   
        this.spinner.hide();   
        this.clienteMultiSelectReservar.checkAll(); 
        this.clienteMultiSelectReservar.uncheckAll();
        this.clienteMultiSelectTarifa.checkAll(); 
        this.clienteMultiSelectTarifa.uncheckAll();
        this.clienteMultiSelectProducto.checkAll(); 
        this.clienteMultiSelectProducto.uncheckAll();
        this.clienteMultiSelectOcupar.checkAll(); 
        this.clienteMultiSelectOcupar.uncheckAll(); 
        this.tarifaMultiSelectOcupar.checkAll();
        this.tarifaMultiSelectOcupar.uncheckAll();
        this.productoMultiSelectOcupar.checkAll(); 
        this.productoMultiSelectOcupar.uncheckAll(); 
        
        this.selectMedioPago = []; 
        this.tarifaData = [];
        this.ProductoServicioData = [];
        this.clienteData = [];
        this.formReservacionArray = this.FB.array([]); 
        this.formOcuparArray = this.FB.array([]);  
        this.fechaFinal = "";
        this.fechaInicio = ""; 
        this.descripcionReserva = "";
        this.totalPagarOcupar = 0;
        this.totalPagarReserva = 0;
        this.abonosTotal = 0;
        this.abonosTotalOcupar = 0;
        this.formReserva.reset();
        this.formOcupar.reset();

        if(this.estadoHabitacion == 5){
          //reservar
          this.reservacionModalVisible = true; 
          this.validacionesReserva();
        }

        if(this.estadoHabitacion == 2){
          //ocupar
          this.validacionesOcupacion();

          this.ocuparModalVisible = true;  
        }
        
        let dataCliente = response.cliente;
        let dataMedioPago = response.metodos_pago;
        let dataTarifa = response.tarifa;


        dataCliente.forEach(element => {
          this.clienteData.push({
            name: element.numero_documento +' '+element.nombres +' '+ element.apellidos ,
            code: element.numero_documento,
            id: element.id,
          }) 
        });

        dataMedioPago.forEach(element => {
          this.selectMedioPago.push({
            nombre: element.nombre,
            id: element.id
          }) 
        });

        dataTarifa.forEach(element => {
          this.tarifaData.push({
            nombre: element.nombre,
            id: element.id,
            tipo: element.tipo,
            valor: element.valor,
            icon: element.tipo==1?'pi pi-hourglass':'pi pi-moon',
          }) 
        })

        let dataProducto = response.productos; 

        dataProducto.forEach(element => {  
          this.ProductoServicioData.push({
            name: element.nombre,
            code: element.id,
            valor: element.precio,
            tipo: element.tipo_producto
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

  submitAsignarLimpieza(){ 
    if(this.formLimpieza.valid){
      let data = {
        empleado_id: this.formLimpieza.value.empleado[0].code,
        descripcion: this.formLimpieza.value.descripcion,
        fecha_final: this.datePipe.transform(this.formLimpieza.value.fechaFinal, 'yyyy-MM-dd HH:mm:ss'),
        fecha_inicio: this.datePipe.transform(this.formLimpieza.value.fechaInicio, 'yyyy-MM-dd HH:mm:ss'),
        habitacion_id: this.habitacionId,
      } 

    this.enviarLimpieza(data);
      
    }
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
          this.formLimpieza.reset();
          this.visibleModalLimpieza = true; 
        } else if(parametros.estado == 6){
          this.formMantenimiento.reset();
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
    if(this.formMantenimiento.valid){

      let data = {
        empleado_id: this.formMantenimiento.value.empleado[0].code,
        descripcion: this.formMantenimiento.value.descripcion,
        fecha_final: this.datePipe.transform(this.formMantenimiento.value.fechaFinal, 'yyyy-MM-dd HH:mm:ss'),
        fecha_inicio: this.datePipe.transform(this.formMantenimiento.value.fechaInicio, 'yyyy-MM-dd HH:mm:ss'),
        habitacion_id: this.habitacionId,
      } 

      this.enviarMantenimiento(data);

    }
  }

  checkTarifaReserva($event){ 

    this.tarifasAgregadasReserva = [];
    this.tarifasAgregadasReserva = $event.value;

    //this.tarifasAgregadasReserva = this.tarifasAgregadasReserva.filter(item => item !== $event.itemValue);
  
    this.calcularTotalTarifaReserva();
    this.calcularTotalReserva(); 

  }

  checkProducto($event){ 
    this.productosAgregadosReserva  = $event.value;

    this.calcularTotalProductosReserva(); 
    this.calcularTotalReserva(); 
  }

  calcularTotalTarifaReserva() {
    this.tarifasTotal = 0;

    this.tarifasAgregadasReserva.forEach(element => {   
      this.tarifasTotal = this.tarifasTotal  + parseFloat(element.valor);
    })
  }

  calcularTotalReserva(){


    this.totalPagarReserva = this.tarifasTotal + this.productosTotal;

    this.validacionesReserva();
  }



  calcularTotalProductosReserva(){
    this.productosTotal = 0;

    this.productosAgregadosReserva.forEach(element => {   
      this.productosTotal = this.productosTotal  + parseFloat(element.valor);
    })
  }

  changeMedioPagoReserva(){

    this.abonosTotal = 0;

    this.formReservacionArray.value.forEach(element => {
      this.abonosTotal = this.abonosTotal + parseFloat(element.monto)
    })  

    this.validacionesReserva();
  }

  validacionesReserva(){
    let errores = false;
    if(this.abonosTotal > this.totalPagarReserva){
      this.disableReserva = true;
      errores = true;
    } 

    if(this.fechaFinal < this.fechaInicio ){
      this.disableReserva = true;
      errores = true;
    }  

    if(this.totalPagarReserva <= 0){
      this.disableReserva = true;
      errores = true;
    }

    if(!this.fechaFinal){
      this.disableReserva = true;
      errores = true;
    }

    if(!this.fechaInicio){
      this.disableReserva = true;
      errores = true;
    }

    if(this.tarifasAgregadasReserva.length <= 0){
      this.disableReserva = true;
      errores = true;
    }


    if(!errores){
      this.disableReserva = false;
    }
  }

  fechaInicioChange(){

    this.validacionesReserva();
  }


  fechaFinalChange(){ 
    this.validacionesReserva(); 
  }

  /*ocupar */

  checkTarifaOcupar($event){
    this.tarifasAgregadasOcupar = [];
    this.tarifasAgregadasOcupar = $event.value;

    this.calcularTotalTarifaOcupar();
    this.calcularTotalOcupar(); 
  }

  checkProductoOcupar($event){
    this.productosAgregadosOcupar  = $event.value;

    this.calcularTotalProductosOcupar(); 
    this.calcularTotalOcupar(); 
  }

  calcularTotalProductosOcupar(){
    this.productosTotalOcupar = 0;

    this.productosAgregadosOcupar.forEach(element => {   
      this.productosTotalOcupar = this.productosTotalOcupar  + parseFloat(element.valor);
    })
  }

  calcularTotalTarifaOcupar(){ 
    this.tarifasTotalOcupar = 0;

    this.tarifasAgregadasOcupar.forEach(element => {   
      this.tarifasTotalOcupar = this.tarifasTotalOcupar  + parseFloat(element.valor);
    })
  }


  calcularTotalOcupar(){

    this.totalPagarOcupar = this.tarifasTotalOcupar + this.productosTotalOcupar;
    this.validacionesOcupacion();

  }

  validacionesOcupacion(){
    let errores = false;
    if(this.abonosTotalOcupar > this.totalPagarOcupar){
      this.disableOcupar = true;
      errores = true;
    } 


    if(this.totalPagarOcupar <= 0){
      this.disableOcupar = true;
      errores = true;
    }

    if(this.tarifasAgregadasOcupar.length<=0){
      this.disableOcupar = true;
      errores = true;
    }

    if(!errores){
      this.disableOcupar = false;
    }
  }

  changeMedioPagoOcupar(){
    this.abonosTotalOcupar = 0;

    this.formOcuparArray.value.forEach(element => {
      this.abonosTotalOcupar = this.abonosTotalOcupar + parseFloat(element.monto)
    })  

    this.validacionesReserva();
  }

  /*ocupar */

  submitReserva(){

    let fechaInicio = this.datePipe.transform(this.fechaInicio, 'yyyy-MM-dd HH:mm:ss');
    let fechaFinal = this.datePipe.transform(this.fechaFinal, 'yyyy-MM-dd HH:mm:ss');
    let cliente = this.clienteMultiSelectReservar.value[0].id;
    let subtotal = this.totalPagarReserva;
    let total = this.totalPagarReserva - this.abonosTotal;
    let tarifas = this.clienteMultiSelectTarifa.value;
    let productos = this.clienteMultiSelectProducto.value;

    let reservar = {
      fecha_inicio: fechaInicio,
      fecha_final: fechaFinal,
      cliente_id: cliente,
      total: total,
      subtotal: subtotal,
      tarifas: tarifas,
      productos: productos,
      descripcion: this.descripcionReserva,
      habitacion_id: this.habitacionId,
      hotel_id: this.hotelId,
      abonos: this.formReservacionArray.value,
    }

    this.enviarReservar(reservar);

  }

  descripcionReservaInput(input){ 
    this.descripcionReserva = input; 
  }

  submitOcupar(){

    let cliente = this.clienteMultiSelectOcupar.value[0].id;
    let total = this.totalPagarOcupar- this.abonosTotalOcupar;
    let subtotal = this.totalPagarOcupar;
    let tarifas = this.tarifaMultiSelectOcupar.value;
    let productos = this.productoMultiSelectOcupar.value;
  
    let reservar = {
      cliente_id: cliente,
      total: total,
      subtotal: subtotal,
      tarifas: tarifas,
      productos: productos,
      descripcion: this.formReserva.get('descripcionReserva').value,
      habitacion_id: this.habitacionId,
      hotel_id: this.hotelId,
      abonos: this.formOcuparArray.value,
    }

    this.enviarOcupar(reservar);
  }

  changeFechaMantenimiento(){ 
    let fechaInicio = this.formMantenimiento.get('fechaInicio').value;
    let fechaFinal = this.formMantenimiento.get('fechaFinal').value; 

    if(fechaInicio>fechaFinal){
      this.disableButtonMantenimiento = true;
    } else {
      this.disableButtonMantenimiento = false;
    }
  }

  changeFechaLimpieza($event){
    let fechaInicio = this.formLimpieza.get('fechaInicio').value;
    let fechaFinal = this.formLimpieza.get('fechaFinal').value; 

    if(fechaInicio>fechaFinal){
      this.disableButtonLimpieza = true;
    } else {
      this.disableButtonLimpieza = false;
    }
  }
}
