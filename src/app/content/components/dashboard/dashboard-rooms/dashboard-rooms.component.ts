import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-rooms',
  templateUrl: './dashboard-rooms.component.html',
  styleUrls: ['./dashboard-rooms.component.scss']
})
export class DashboardRoomsComponent implements OnInit  {
  ngOnInit(): void {
    this.buildForm();
    this.getIndex(); 
  }

  constructor( 
  ){

  }

  buildForm(){

  }

  getIndex(){

  }
}
