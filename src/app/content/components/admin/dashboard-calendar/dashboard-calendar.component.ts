import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'; 
import esLocale from '@fullcalendar/core/locales/es'; // Importa el idioma español
import { DashboardCalendarService } from 'src/app/content/service/dashboard-calendar/dashboard-calendar.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { B } from '@fullcalendar/core/internal-common';
import { LocaleSettings } from 'primeng/calendar/public_api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


interface dataEvento {
  nombre: string,
  id: number,
  fechaInnicio: string,
  fechaFin: string,
  todoElDia: boolean,
}

@Component({
  selector: 'app-dashboard-calendar',
  templateUrl: './dashboard-calendar.component.html',
  styleUrls: ['./dashboard-calendar.component.scss']
})

export class DashboardCalendarComponent { 
  public hotelId:number;
  public habitacionesReservadas: any[] = [] ;
  public reservacionModalVisible: boolean = false;
  public reservaForm: FormGroup;
  public selectMedioPago: any[] = [] ;
  public formReservacionArray: FormArray;  
  public nombreHabitacionReservada: string;
  public clienteData: any[] = [] ;
  public habitacionData: any[] = [] ;
  public tarifaData: any[] = [] ;
  public abonosTotal: number = 0;
  public disableReserva: boolean = false;
  public totalPagarReserva : number = 0; 
  public productosTotal : number = 0;
  public tarifasTotal : number = 0;
  public ProductoServicioData: any[] = [] ;
  public tarifasAgregadasReserva: any[] = [] ;
  public dayNamesSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  public dayNamesShortSpanish = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  public monthNamesSpanish = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public monthNamesShortSpanish = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  public hoy: Date;
  public productosAgregadosReserva: any[] = [] ;
  public primeraVez:boolean = true;
  private tipo_habitacion: number = 0;
  public tarifasSeleccionas: any[] = [];
  public localeSettingsSpanish: LocaleSettings = {
    firstDayOfWeek: 1, // Lunes es el primer día de la semana
    dayNames: this.dayNamesSpanish,
    dayNamesShort: this.dayNamesShortSpanish,
    monthNames: this.monthNamesSpanish,
    monthNamesShort: this.monthNamesShortSpanish,
    today: 'Hoy',
    clear: 'Borrar',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'Sm'
};
  option: any = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    initialView: 'dayGridMonth',
   // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: false,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: esLocale, 
  };
  idGenerato:number = 50;
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>(this.option);
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dashboardCalendarService: DashboardCalendarService,
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private dashboardRoomsService:DashboardRoomsService, 
    private datePipe: DatePipe,
    private router: Router
    ) 
  {
    this.formReservacionArray = this.FB.array([]); 
  }

  ngOnInit(){
    this.spinner.hide();
    let currentUser:any = JSON.parse(localStorage.getItem('currentUser'));  
    this.hotelId = currentUser.usuario.datalle_hoteles[0].hotel_id;
    this.reservaForm = this.FB.group({
        habitacion_id: ['',[Validators.required]],
        cliente_id: ['',[Validators.required]],
        tarifa_id: ['',[Validators.required]],
        producto_id: ['',[]],
        abonos: this.formReservacionArray,
        descripcion:  ['',[Validators.required]],
        fechaInicio:  ['',[Validators.required]],
        fechaFinal:  ['',[Validators.required]],
    });
    
    this.getCalendariHabitacionesReservadas();
  }

  agregarAbono(){ 

    let form =  this.FB.group({ 
      monto: ['', [Validators.required, Validators.min(0)]],
      medio_pago: [this.selectMedioPago[0], [Validators.required, Validators.min(0)]],
    }); 

    this.formReservacionArray.push(
      form
    );
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.mutate((options) => {
      options.weekends = !options.weekends;
    });
  }

  changeMedioPagoReserva(){
    this.abonosTotal = 0;
    
    this.formReservacionArray.value.forEach(element => {
      console.log(element.monto)
      this.abonosTotal =  this.abonosTotal + element.monto;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.primeraVez = true;
    this.habitacionData = [];
    this.reservaForm.reset();
    this.reservaForm.disable();
    this.reservaForm.get('habitacion_id').enable();

    this.getReserva();
    /*const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: this.createEventId()+'',
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }*/

    this.reservaForm.get('fechaInicio').setValue( this.subtractDays(new Date(selectInfo.startStr), 1));
    this.reservaForm.get('fechaFinal').setValue(new Date(selectInfo.endStr));

    this.reservacionModalVisible = true
  }

    subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  handleEventClick(clickInfo: EventClickArg) { 
    let detalleHabitacionid = clickInfo.event._def.publicId;
    this.router.navigate(['dashboard/calendar/'+detalleHabitacionid+'/detailRoom']);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  eventoData(){
    //console.log(new Date().toISOString().replace(/T.*$/, ''));
    let dataEvento:EventInput[] = [
      {
        id: '1',
        title: 'Hbitacion 2',
        start:  new Date('2024-01-27T10:00:00'),
        end: new Date('2024-01-28T10:00:00'), 
      },
      {
        id: '2',
        title: 'Hbitacion 3',
        start:  new Date('2024-01-29T10:00:00'),
        end: new Date('2024-01-30T10:00:00'), 
      },
    ]; 

    this.option.events = dataEvento;
  }

  createEventId(){
    this.idGenerato ++;
  }

  getCalendariHabitacionesReservadas(){
    let data = {
      hotel_id: this.hotelId,
    }

    this.dashboardCalendarService.getHabitacionesCalendario(data).subscribe(
      (response: any) => {
          let dataEvento:EventInput[] = []; 
          this.habitacionesReservadas = response.habitaciones;
          response.habitaciones.forEach(element => {
            console.log(element)
            let evento = {
              id: element.id,
              title: element.habitacion.nombre + ' '+ element.cliente.nombres+' '+ element.cliente.apellidos ,
              start: new Date(element.fecha_inicio),
              end: new Date(element.fecha_salida), 
            }
      
            let pasar = true;

            dataEvento.forEach(element => {
              if(element.id == evento.id){
                pasar = false;
              } 
            });  

            if(pasar){ 
              dataEvento.push(evento); 
            }


          });  

          this.option.events = dataEvento;

      } 

    );


  }

  reservarSubmit(){ 
    if(this.reservaForm.enable){
      let data = {
        abonos: this.formReservacionArray.value,
        cliente_id: this.reservaForm.get('cliente_id').value[0].id,
        descripcion: this.reservaForm.get('descripcion').value,
        fecha_final: this.datePipe.transform(this.reservaForm.get('fechaFinal').value, 'yyyy-MM-dd HH:mm:ss'),
        fecha_inicio: this.datePipe.transform(this.reservaForm.get('fechaInicio').value, 'yyyy-MM-dd HH:mm:ss'),
        habitacion_id: this.reservaForm.get('habitacion_id').value[0].id,
        hotel_id: this.hotelId, 
        subtotal: this.totalPagarReserva - this.abonosTotal,
        total: this.totalPagarReserva,
        tarifas: this.reservaForm.get('tarifa_id').value,
      }

      this.enviarReservar(data);
    }
  }

  

  busquedaCliente(event){

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

          this.getCalendariHabitacionesReservadas();

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

  

  checkTarifaReserva(event){
    this.tarifasTotal = 0;
    this.tarifasSeleccionas = [];
    this.reservaForm.get('tarifa_id').value.forEach(element => {
      this.tarifasTotal = this.tarifasTotal + parseInt(element.valor);
      this.tarifasSeleccionas.push(element)
    });

    this.validacionesReserva();
  }

  getReserva(clienteBusqueda:string =''){
    this.spinner.show();  
    
    let data = {
      'hotel_id':this.hotelId,
      'cliente_busqueda': clienteBusqueda,
      'tipo_habitacion': this.tipo_habitacion,
    };

    this.dashboardRoomsService.getReserva(data).subscribe(
      (response: any) => {   
        this.spinner.hide();    
        
        let dataCliente = response.cliente;
        let dataMedioPago = response.metodos_pago;
        let dataTarifa = response.tarifa;
        let dataHabitacion = response.habitacion
        let dataProducto = response.productos; 

        this.clienteData = []; 
        this.selectMedioPago = [];
        this.tarifaData = [];
        this.ProductoServicioData = [];

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

        if(this.primeraVez) {

          dataHabitacion.forEach(element => {
            this.habitacionData.push({
              name: element.nombre,
              tipo: element.tipo,
              id: element.id,
            }) 
          });

          this.primeraVez = false;
        } else {
          this.reservaForm.enable();
        }


        dataTarifa.forEach(element => {
          this.tarifaData.push({
            nombre: element.nombre,
            id: element.id,
            tipo: element.tipo,
            valor: element.valor,
            icon: element.tipo!=1?'pi pi-hourglass':'pi pi-moon',
          }) 
        })


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

  validacionesReserva(){
    this.totalPagarReserva = 0;
    this.totalPagarReserva = this.productosTotal + this.tarifasTotal ;
  }

  selectHabitacion(event){
    if(event.value){
      this.tipo_habitacion = event.value[0].tipo; 
      this.getReserva();
    } 
  }

  checkProductoServicio($event){
    this.productosTotal = 0;
    this.ProductoServicioData.forEach(element => {
      this.productosTotal = this.productosTotal  + parseInt(element.valor);
    });
  }
}
