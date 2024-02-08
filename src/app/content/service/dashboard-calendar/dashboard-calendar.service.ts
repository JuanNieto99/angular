import { Injectable } from '@angular/core';
import { Config } from '../../storage/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardCalendarService {
  private baseUrl: string;
  private endpointHabitacionesReservada: string; 
  public data: Observable<any[]>;

  constructor(    
    private httpClient: HttpClient, 
    ) {
      this.baseUrl = Config.url;
      this.endpointHabitacionesReservada = '/getReservasHabitacionesCalendario'; 
    }

    getHabitacionesCalendario(parametros:any): Observable<any>{
      return this.httpClient.post<any>(`${this.baseUrl+this.endpointHabitacionesReservada}`, parametros); 
    }
}
