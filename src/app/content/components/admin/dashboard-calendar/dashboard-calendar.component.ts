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
  public abonosTotal: number;
  public disableReserva: boolean = false;
  public totalPagarReserva : number; 
  public productosTotal : number;
  public tarifasTotal : number;
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
    editable: true,
    selectable: true,
    selectMirror: true,
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
    ) {
    this.formReservacionArray = this.FB.array([]); 

  }

  ngOnInit(){
    let currentUser:any = JSON.parse(localStorage.getItem('currentUser'));  
    this.hotelId = currentUser.usuario.datalle_hoteles[0].hotel_id;
    this.reservaForm = this.FB.group({
        habitacion_id: ['',[Validators.required]],
        cliente_id: ['',[Validators.required]],
        tarifa_id: ['',[Validators.required]],
        producto_id: ['',[Validators.required]],
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
    )

  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.mutate((options) => {
      options.weekends = !options.weekends;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.primeraVez = true;
    this.habitacionData = [];
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
    
    this.reservaForm.get('fechaInicio').setValue( new Date(selectInfo.startStr));
    this.reservaForm.get('fechaFinal').setValue( new Date(selectInfo.endStr));

    this.reservacionModalVisible = true
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
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
            dataEvento.push(evento);
          });

          this.option.events = dataEvento;

      } 

    );


  }

  reservarSubmit(){
    console.log(this.reservaForm.value)
  }

  busquedaCliente(event){

  }
  
 

  checkProducto(event){

  }

  checkTarifaReserva(event){

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

  }

  selectHabitacion(event){
    if(event.value){
      this.tipo_habitacion = event.value[0].tipo; 
      this.getReserva();
    } 
  }
}
