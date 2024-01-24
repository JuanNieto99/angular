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

  constructor(private httpClient: HttpClient) {
      this.baseUrl = Config.url;
      this.endpointListar = '/habitacionesDashboard'; 
      this.endpointPisos = '/habitacionesDashboardPisos'; 
  }

  getDashboardRooms(parametros:any): Observable<dashboardRooms[]> { 
      return this.httpClient.post<dashboardRooms[]>(`${this.baseUrl+this.endpointListar}`, parametros);
  }

  getPisos(parametros:any){
    return this.httpClient.post<dashboardRooms[]>(`${this.baseUrl+this.endpointPisos}`, parametros);
  }

}
