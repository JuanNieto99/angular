import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalSequenceRoutingModule } from './external-sequence-routing.module';
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
import { CalendarModule } from "primeng/calendar";
import { ToolbarModule } from 'primeng/toolbar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminInterceptor } from 'src/app/content/interceptors/admin.interceptor';
import { ExternalSequenceService } from '../../../service/externalSequence/external-sequence.service';
import { ExternalSequenceComponent } from './external-sequence.component';


@NgModule({
  imports: [
    CommonModule,
    ExternalSequenceRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    CalendarModule,
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
    PaginatorModule
  ],providers: [
    {
        provide:HTTP_INTERCEPTORS,
        useClass:AdminInterceptor,
        multi:true
    },
    ExternalSequenceService,
  ],
    declarations: [ExternalSequenceComponent]
})
export class ExternalSequenceModule { }
