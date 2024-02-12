import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';

@Component({
  selector: 'app-dashboard-rooms-ocupar',
  templateUrl: './dashboard-rooms-ocupar.component.html',
  styleUrls: ['./dashboard-rooms-ocupar.component.scss']
})
export class DashboardRoomsOcuparComponent {

  public form: FormGroup;  

  constructor( 
    private dashboardRoomsService:DashboardRoomsService, 
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router: Router,
  ){ 
  }

  ngOnInit(){
    this.buildForm();
  }

  buildForm(){ 
    this.form = this.FB.group({
      habitacion_nombre : ['',[]],
      cliente_id: ['',[]],
      checkIn: ['',[]],
      checkOut: ['',[]],
      descripcion:  ['',[]],
    });
    
  }
}
