import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardRoomsService } from 'src/app/content/service/dashboardRooms/dashboard-rooms.service';

@Component({
  selector: 'app-dashboard-rooms-ocupar',
  templateUrl: './dashboard-rooms-ocupar.component.html',
  styleUrls: ['./dashboard-rooms-ocupar.component.scss']
})
export class DashboardRoomsOcuparComponent {

  public form: FormGroup;  
  public habitacionId: number;

  constructor( 
    private dashboardRoomsService:DashboardRoomsService, 
    private FB: FormBuilder,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
  ){ 
  }

  ngOnInit(){
    this.habitacionId = parseInt(this.route.snapshot.paramMap.get('idHabitacion'));  
    this.buildForm();
    this.getRoomOcupar();
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

  getRoomOcupar(){
      let data = {
        habitacion_id : this.habitacionId,
      } 
      this.spinner.show();
      this.dashboardRoomsService.getOcuparHabitacion(data).subscribe(reques => {
        this.spinner.hide();
        console.log(reques)
      })
  }
}
