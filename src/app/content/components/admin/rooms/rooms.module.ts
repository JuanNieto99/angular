import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminInterceptor } from 'src/app/content/interceptors/admin.interceptor';
import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsService } from 'src/app/content/service/rooms/rooms.service';
import { RoomsComponent } from './rooms.component';


@NgModule({
  imports: [
    CommonModule,
    RoomsRoutingModule,
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
    PaginatorModule
  ],providers: [
    {
        provide:HTTP_INTERCEPTORS,
        useClass:AdminInterceptor,
        multi:true
    },
    RoomsService,
  ],
    declarations: [RoomsComponent]
})
export class RoomsModule { }
