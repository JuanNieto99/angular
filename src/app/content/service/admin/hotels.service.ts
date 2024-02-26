import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { country, state, city, Hotel } from 'src/app/content/models/admin/hotels.model';
import { Config } from '../../storage/config';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  private baseUrl: string;
  private endpointCountry: string;
  private endpointState: string;
  private endpointCity: string;
  private endpointHotelsListar: string;
  private endpointHotelMostrar: string;
  private endpointHotelCrear: string;
  private endpointHotelActualizar: string;
  private endpointHotelEliminar: string;
  private dataSubject: BehaviorSubject<Hotel[]>;
  public data: Observable<Hotel[]>;

  constructor(private httpClient: HttpClient) {
    this.dataSubject = new BehaviorSubject<Hotel[]>([]);
    this.baseUrl = Config.url;
    this.endpointCountry = '/paisListar';
    this.endpointState = '/departamentoPaisListar';
    this.endpointCity = '/ciudadDepartamentoListar';
    this.endpointHotelsListar = '/hotelListar';
    this.endpointHotelMostrar = '/hotelMostrar/';
    this.endpointHotelCrear = '/hotelCrear/';
    this.endpointHotelActualizar = '/hotelActualizar/';
    this.endpointHotelEliminar = '/hotelEliminar/';
    this.data = this.dataSubject.asObservable();
  }

  getAll(per_page: number, search: string = '', page: number = 1): Observable<Hotel[]> {
    const parametros = {};
    return this.httpClient.post<Hotel[]>(`${this.baseUrl + this.endpointHotelsListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
  }

  getHotel(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl + this.endpointHotelMostrar + id}`);
  }

  refreshHotelsData(): void {
    this.getAll(30).subscribe(
      (response: any) => {
        this.dataSubject.next(response.data);
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  createHotel(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl + this.endpointHotelCrear}`, data);
  }

  deleteHotel(id: number): Observable<any> {
    const parametros = { id: id };
    return this.httpClient.post<any>(`${this.baseUrl + this.endpointHotelEliminar}`, parametros);
  }

  updateHotel(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl + this.endpointHotelActualizar}`, data);
  }

  getCountries(): Observable<country[]> {
    const parametros = { id: '' };
    return this.httpClient.post<any>(`${this.baseUrl + this.endpointCountry}`, parametros)
      .pipe(
        map(response => {
          if (response && response.data && Array.isArray(response.data)) {
            return response.data;
          } else {
            return [];
          }
        }),
        catchError(error => {
          console.log('Error:', error);
          return [];
        })
      );
  }

  getStates(countryId: any): Observable<state[]> {
    const parametros = { id: countryId };
    return this.httpClient.post<state[]>(`${this.baseUrl + this.endpointState}`, parametros);
  }

  getCities(stateId: any): Observable<city[]> {
    const parametros = { id: stateId };
    return this.httpClient.post<city[]>(`${this.baseUrl + this.endpointCity}`, parametros);
  }
}

