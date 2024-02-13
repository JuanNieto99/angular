import { Injectable } from '@angular/core';
import { Config } from '../../storage/config';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { dashboardRooms } from '../../models/dashboard/dashboard-rooms.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardRoomsService {

  private baseUrl: string;
  private endpointListar: string; 
  private endpointPisos: string; 
  private endpointReservar: string; 
  private endpointGetReservar: string; 
  private endpointAnularReserva: string; 
  private endpointMantenimiento: string; 
  private endpointAnularMantenimiento: string; 
  private endpointOcupar: string; 
  private endpointDesocupar: string; 
  private endpointLimpieza: string; 
  private endpointAnularLimpieza: string; 
  private endpointGetProductoReserva: string; 
  private endpointGetEmpleadoHabitacion: string;
  private endpointOcupacionReserva: string;
  private endpointRoomOcupar: string;

  constructor(private httpClient: HttpClient) {
      this.baseUrl = Config.url;
      this.endpointListar = '/habitacionesDashboard'; 
      this.endpointPisos = '/habitacionesDashboardPisos'; 
      this.endpointGetReservar = '/getReserva'; 
      this.endpointReservar = '/habitacionesReservar'; 
      this.endpointAnularReserva = '/habitacionesReservarAnular';
      this.endpointMantenimiento = '/habitacionesMantenimiento';
      this.endpointAnularMantenimiento = '/habitacionesMantenimientoAnular';
      this.endpointOcupar = '/ocuparHabitacionCliente';
      this.endpointDesocupar = '/desocuparHabitacionCliente';
      this.endpointLimpieza = '/habitacionesLimpieza';
      this.endpointAnularLimpieza = '/habitacionesLimpiezaAnular';
      this.endpointGetProductoReserva ='/gatProductosServicio';
      this.endpointGetEmpleadoHabitacion ='/getEmpleadosHabitacion';
      this.endpointOcupacionReserva = '/checkinReserva';
      this.endpointRoomOcupar = '/getRoomDashBoard'

  }

  getDashboardRooms(parametros:any): Observable<dashboardRooms[]> { 
      return this.httpClient.post<dashboardRooms[]>(`${this.baseUrl+this.endpointListar}`, parametros);
  }

  getPisos(parametros:any){
    return this.httpClient.post<dashboardRooms[]>(`${this.baseUrl+this.endpointPisos}`, parametros);
  }

  getReserva(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointGetReservar}`, parametros); 
  }

  reservar(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointReservar}`, parametros); 
  }

  anularReserva(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointAnularReserva}`, parametros); 
  }

  mantenimiento(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointMantenimiento}`, parametros); 
  }

  anularMantenimiento(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointAnularMantenimiento}`, parametros); 
  }

  ocupar(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointOcupar}`, parametros); 
  }

  desocupar(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointDesocupar}`, parametros); 
  }

  limpieza(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointLimpieza}`, parametros); 
  }

  anularLimpieza(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointAnularLimpieza}`, parametros); 
  }

  getProductoServicio(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointGetProductoReserva}`, parametros); 
  }

  getEmpleadoHabitacion(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointGetEmpleadoHabitacion}`, parametros); 
  }

  ocuparReserva(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointOcupacionReserva}`, parametros); 
  }

  getOcuparHabitacion(parametros:any){
    return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointRoomOcupar}`, parametros); 
  }
}
