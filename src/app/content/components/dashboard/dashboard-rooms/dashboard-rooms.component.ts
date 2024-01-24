import { Component, OnInit } from '@angular/core';
import { dashboardRooms } from 'src/app/content/models/dashboard/dashboard-rooms.model';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import {  MenuItem } from 'primeng/api';

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
}
@Component({
  selector: 'app-dashboard-rooms',
  templateUrl: './dashboard-rooms.component.html',
  styleUrls: ['./dashboard-rooms.component.scss']
})

export class DashboardRoomsComponent implements OnInit  {

  public menuHabitacion: MenuItem [] =  [
    {
        label: 'Opciones',
        items: [
            {
              label: 'Reservar',
              icon: 'pi pi-calendar-times'
            },
            {
                label: 'Disponible',
                icon: 'pi pi-lock-open'
            },
            {
                label: 'Limpieza',
                icon: 'pi pi-exclamation-triangle'
            },
            {
              label: 'Mantenimiento',
              icon: 'pi pi-wrench'
            },
            {
              label: 'Ocupar',
              icon: 'pi pi-lock'
            }
        ]
    }, 
];
;
  private hotelId: number;
  private pisoId: number;
  private primerPiso: number = 1;
  private dataDashBoardRooms: dashboardRooms;
  public dataRoomsPisos: any[];
  public htmlContent: string;
  public dataRoom: dataRoomPiso [] = [];

  ngOnInit(): void {
    this.hotelId = 1; 
    this.pisoId = 1; 
    this.primerPiso = this.pisoId;
    let currentUser:any = localStorage.getItem('currentUser');
    console.log(currentUser.usuarioHotel)
    this.buildForm();
    this.getRoomsDashboardPisos();  
  }

  constructor( 
    private dashboardRoomsService:DashboardRoomsService
  ){

  }

  buildForm(){ 
    setTimeout(() => {
     // console.log(this.dataRoom);
    }, 2000);
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

          this.dataDashBoardRooms = response;
          
          let pisoEncontrado = this.dataRoom.find(piso => piso.piso == this.pisoId);
            pisoEncontrado.loading = false;
            response.forEach(habitaciones => {
                pisoEncontrado.habitaciones.push
                (
                  { 
                      nombre: habitaciones.nombre,
                      json: habitaciones.diseno_json 
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

  opcionesHabitacion($event, opcion){
    console.log("1")
    console.log(opcion)
    console.log($event)


  }

  opcionesHabitacion2($event, opcion){
    console.log("1")
    console.log(opcion)
    console.log($event)


  }
}
