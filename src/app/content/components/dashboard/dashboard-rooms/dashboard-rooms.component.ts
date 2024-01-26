import { Component, OnInit, ViewChild } from '@angular/core';
import { dashboardRooms } from 'src/app/content/models/dashboard/dashboard-rooms.model';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import {  MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';  

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
}
@Component({
  selector: 'app-dashboard-rooms',
  templateUrl: './dashboard-rooms.component.html',
  styleUrls: ['./dashboard-rooms.component.scss']
})

export class DashboardRoomsComponent implements OnInit  {
  @ViewChild('op1') op1: OverlayPanel;

  public menuHabitacion: MenuItem [];
  public fechaInicio: any;
  public fechaFinal: any;
  public selectedMulti: any[] = [];

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
  public cliente: any;
  public clienteData: any;

  ngOnInit(): void {
    this.pisoId = 1; 
    this.primerPiso = this.pisoId;
    let currentUser:any = JSON.parse(localStorage.getItem('currentUser')); 

    this.hotelId = currentUser.usuario.datalle_hoteles[0].hotel_id;
    //this.buildForm();
    this.getRoomsDashboardPisos();
    this.clienteData = [];
  }

  constructor( 
    private dashboardRoomsService:DashboardRoomsService, 
    private FB: FormBuilder,
    private spinner: NgxSpinnerService
  ){

  }

  buildForm(){ 
    this.formReservacion =  this.FB.group({
      habitacion_id: ['',[Validators.required]],
      hotel_id: ['',[Validators.required]],
      cliente_id: ['',[Validators.required]],
      fecha_inicio: ['',[Validators.required]],
      fecha_final: ['',[Validators.required]],
    }); 
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
    console.log("habitacion")  
    console.log(habitacion)
    this.habitacionId = habitacion.id;
    
  }

  opcionSeleccionada($event, habitacion){
    this.estadoHabitacion = $event.item.id;
    setTimeout(() => {
      this.accionMenuHabitaciones();
    }, 500); 
    
  }


  accionMenuHabitaciones(){
    let parametros  = {}; 
    console.log(this.estadoHabitacion)
    
    if(this.estadoHabitacion == 5){
      //reserva
      this.reservar();
    } else if(this.estadoHabitacion == 4) {
        //Limpieza
        parametros = {
          id_habitacion: this.habitacionId, 
        }; 
        this.limpieza(parametros);
    }  else if(this.estadoHabitacion == 6) {
        //Mantenimiento
        parametros = {
          id_habitacion: this.habitacionId, 
        }; 

        this.enviarMantenimiento(parametros);
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
    let estadoHabitaciones = [];

    
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

    this.enviarOcupar(parametros);
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
        this.reservacionModalVisible = true;
        let data = response.cliente;
        this.clienteData = [];
        data.forEach(element => {
          this.clienteData.push({
            name: element.nombres +  element.apellidos,
            code: element.numero_documento
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


}
