import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminInterceptor } from 'src/app/content/interceptors/admin.interceptor';

import { DashboardCalendarRoutingModule } from './dashboard-calendar-routing.module';
import { DashboardCalendarService } from 'src/app/content/service/dashboard-calendar/dashboard-calendar.service';
import { DashboardCalendarComponent } from './dashboard-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MultiSelectModule } from "primeng/multiselect";
import { ChipModule } from "primeng/chip";
import { ChipsModule } from "primeng/chips";
import { PanelModule } from 'primeng/panel';
import { MessageModule } from 'primeng/message'; 
import { DatePipe } from '@angular/common';
import { CalendarModule } from "primeng/calendar";
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';
import { TagModule } from 'primeng/tag';

@NgModule({ 
  imports: [
    TagModule,
    ChipModule,
    ChipsModule,
    PanelModule,
    MessageModule,
    CommonModule,
    DashboardCalendarRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule, // import ReactiveFormsModule
    NgxSpinnerModule,
    PaginatorModule,
    FullCalendarModule,
    MultiSelectModule,
    CalendarModule
  ],providers: [
    {
        provide:HTTP_INTERCEPTORS,
        useClass:AdminInterceptor,
        multi:true
    },
    [DashboardCalendarService, DashboardRoomsService],
    
    DatePipe
  ],
  declarations: [DashboardCalendarComponent]
})
export class DashboardCalendarModule { }
