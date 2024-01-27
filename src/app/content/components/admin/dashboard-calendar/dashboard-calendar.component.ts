import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'; 
import esLocale from '@fullcalendar/core/locales/es'; // Importa el idioma español


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

  constructor(private changeDetector: ChangeDetectorRef) {

    this.eventoData();

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
    const title = prompt('Please enter a new title for your event');
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
    }
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
  
}
