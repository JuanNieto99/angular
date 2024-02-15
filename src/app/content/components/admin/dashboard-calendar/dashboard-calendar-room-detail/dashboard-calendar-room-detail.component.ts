import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { DashboardCalendarService } from 'src/app/content/service/dashboard-calendar/dashboard-calendar.service';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import Swal from 'sweetalert2';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard-calendar-room-detail',
  templateUrl: './dashboard-calendar-room-detail.component.html',
  styleUrls: ['./dashboard-calendar-room-detail.component.scss']
})
export class DashboardCalendarRoomDetailComponent {

  public idDetalleHabitacion: number;
  public form: FormGroup;
  public dataRoomDetail: any;
  public dataTarifa: any;
  public dataAbonos: any;
  public tarifasTotal: number;
  public abonosTotal: number;
  public items: MenuItem[] = [];
  public totalPagarReserva: number;
  public habitacionId: number;
  public detalleAbonoId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private FB: FormBuilder,
    private dashboardCalendarService: DashboardCalendarService,
    private datePipe: DatePipe,
    private dashboardRoomsService:DashboardRoomsService,
    private spinner: NgxSpinnerService, 
  ) 
  {
    
  }

  ngOnInit(){
    this.spinner.hide();
    this.idDetalleHabitacion = parseInt(this.route.snapshot.paramMap.get('id'));  
    this.buildForm();
    this.getDetalleHabitacion();

    this.items = [
      { label: 'Anular Reserva', icon: 'pi pi-calendar-times' , command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'anularReserva') },
      { label: 'Ocupar Reserva', icon: 'pi pi-lock', command: (event: MenuItemCommandEvent) => this.opcionSelect(event, 'ocuparReserva') }
    ];
  } 

  buildForm(){
    this.form = this.FB.group({
      nombreHabitacion: [this.dataRoomDetail?.habitacion.nombre, []], 
      descripcion: [this.dataRoomDetail?.descripcion, []],
      nombreCliente: [this.dataRoomDetail?.cliente.nombres+' '+this.dataRoomDetail?.cliente.apellidos, []],
      desde: [this.dataRoomDetail?.fecha_inicio, []],
      hasta: [this.dataRoomDetail?.fecha_salida,, []],
    });

    this.form.disable();
  }

  getDetalleHabitacion(){
    let idDetalleHabitacion = this.idDetalleHabitacion;
    this.dashboardCalendarService.getDetalleHabitacionReseva(idDetalleHabitacion).subscribe(
      (response: any) => {
          this.dataRoomDetail = response.detalle_habitacion;
          this.dataTarifa = response.tarifas;
          this.tarifasTotal = 0;
          this.abonosTotal = 0;
          this.totalPagarReserva = 0;
          this.dataAbonos = response.abonos;
          this.habitacionId = response.detalle_habitacion.habitacion_id;
          this.detalleAbonoId = this.dataRoomDetail?.estado_habitacion.id;

          this.dataTarifa.forEach(element => {
            this.tarifasTotal = this.tarifasTotal + parseInt(element.valor);
          });

          this.dataAbonos.forEach(element => {
            this.abonosTotal = this.abonosTotal + parseInt(element.valor);
          });

          this.totalPagarReserva = this.tarifasTotal;

          this.buildForm();
      }
    );
  }

  opcionSelect(select, opcion){
    console.log(opcion)
    if(opcion == 'anularReserva'){
      this.anularReserva();
    } else if(opcion == 'ocuparReserva'){
      this.ocuparReserva();
    }

  }

  ocuparReserva(){
      Swal.fire({
        title: "¿Deseas ocupar esta reserva?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Confirmar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
          if (result.isConfirmed) { 

            let data = {
              habitacion_id: this.habitacionId,
              id_detalle: this.idDetalleHabitacion,
            }

            this.enviarOcuparReserva(data);
              //hacer checkin
          }   

      }); 
  }
  
  enviarOcuparReserva(parametros) {
    this.spinner.show();

    this.dashboardRoomsService.ocuparReserva(parametros).subscribe(
      (response: any) => {    
        this.spinner.hide();   
        let data = response; 
        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Ocupacion exitosa.",
            icon: "success"
          });

          this.router.navigate(['dashboard/calendar']);
          

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

  anularReserva(){
    let parametros = {
      id_habitacion: this.habitacionId, 
      id_detalle: this.idDetalleHabitacion,
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
  }

        
  enviarAnularReserva(parametros){
    this.spinner.show();

    this.dashboardRoomsService.anularReserva(parametros).subscribe(
      (response: any) => {       
        let data = response;
        this.spinner.hide();

        if(data.code == "success"){
          Swal.fire({
            title: "Exito",
            text: "Anulacion Exitosa.",
            icon: "success"
          }); 

          this.router.navigate(['dashboard/calendar']);

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
}
