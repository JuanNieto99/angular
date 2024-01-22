import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './admin-routing.module';
import { AdminInterceptor } from '../../interceptors/admin.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExternalSequenceComponent } from './external-sequence/external-sequence.component';
import { DashboardCalendarComponent } from './dashboard-calendar/dashboard-calendar.component';

@NgModule({
    declarations: [
  
    ExternalSequenceComponent,
       DashboardCalendarComponent
  ],
    imports: [
        CommonModule,
        PagesRoutingModule
    ],
    providers: [
        {
            provide:HTTP_INTERCEPTORS,
            useClass:AdminInterceptor,
            multi:true
        }
    ]
})
export class PagesModule { }
