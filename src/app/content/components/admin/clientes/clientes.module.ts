import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminInterceptor } from '../../../interceptors/admin.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerModule } from "ngx-spinner";
import { PaginatorModule } from 'primeng/paginator';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesService } from 'src/app/content/service/clientes/clientes.service';
import { ClientesComponent } from './clientes.component';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  imports: [
    CommonModule,
    ClientesRoutingModule,
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
    CalendarModule
  ],
    providers: [
    {
        provide:HTTP_INTERCEPTORS,
        useClass:AdminInterceptor,
        multi:true
    },
    ClientesService,
    ],
    declarations: [ClientesComponent]
})
export class ClientesModule { }
