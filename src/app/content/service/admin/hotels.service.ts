import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { country, state, city, Hotel } from "src/app/content/models/admin/hotels.model"
import { Config } from '../../storage/config';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  /// variables Endpoint api
  private baseUrl: string;
  private endpointCountry:string;
  private endpointState:string;
  private endpointCity:string;
  private endpointHotelsListar:string;
  private endpointHotelMostrar:string;
  private endpointHotelActualizar:string;
  private endpointHotelEliminar:string;
  private endpointHotelCrear:string;
  ///// variables para manedar datos de hotel
  private dataSubject: BehaviorSubject<Hotel[]>;
  public data: Observable<Hotel[]>;


  constructor(private httpClient: HttpClient) {
    this.dataSubject = new BehaviorSubject<Hotel[]>([]);
    this.data = this.dataSubject.asObservable();
    this.baseUrl = Config.url;
    this.endpointCountry = '/paisListar';
    this.endpointState = '/departamentoPaisListar';
    this.endpointCity = '/ciudadDepartamentoListar';
    this.endpointHotelCrear = '/hotelCrear';
    this.endpointHotelsListar ='/hotelListar';
    this.endpointHotelMostrar = '/hotelMostrar';
    this.endpointHotelActualizar = '/hotelActualizar';
    this.endpointHotelEliminar ='/hotelEliminar';
  }
  // CRUD HOTELES
  // Consultar hoteles
  getHotels(per_page:number, search:string = '', page:number = 1):Observable<Hotel[]>{
    const parametros = {
      id: '',
      nombre: '',
      direccion: '',
      rol_id: '',
      estado: '',
      contacto:'',
      superadmin: '',
      razon_social: '',
      cantidad_habitaciones: '',
    };
    return this.httpClient.post<Hotel[]>(`${this.baseUrl+this.endpointHotelsListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
  }
  ///// Crear Hotel
  createHotel(data: any): Observable<Hotel[]> {
    return this.httpClient.post<Hotel[]>(`${this.baseUrl+this.endpointHotelCrear}`, data);
  }
  // Consultar un Hotel
  getHotelById(id: number){
    return this.httpClient.get<any>(`${this.baseUrl+this.endpointHotelMostrar}/${id}`)
          .pipe(map(hotel => hotel));
  }
  ////////// Update Hotel //////////////////////
  updateHotel(data:any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointHotelActualizar}`, data);
  }
  deleteHotel(id:number){
    const parametros = {
      id: id
    };
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointHotelEliminar}`, parametros);
  }

  //Actualizar observable de Hoteles

  refresHotelsData(): void {
    this.getHotels(30).subscribe(
        (response: any) => {
          console.log(response.data);
            this.dataSubject.next(response.data);
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
  }

  getCountries(): Observable<country[]> {
    const parametros = { id: '' };
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointCountry}`, parametros)
      .pipe(
        map(response => {
          // Verificar si la respuesta tiene la propiedad 'data'
          if (response && response.data && Array.isArray(response.data)) {
            // Devolver directamente el array 'data'
            return response.data;
          } else {
            // Si la respuesta no tiene la propiedad 'data', devolver un array vacío
            return [];
          }
        }),
        catchError(error => {
          console.log('Error:', error);
          // Manejar el error adecuadamente aquí
          return [];
        })
      );
  }

  getStates(countryId: any): Observable<state[]> {
    const parametros = { id: countryId };
    const url = `${this.baseUrl+this.endpointState}`;
    return this.httpClient.post<state[]>(url, parametros);
  }

  getCities(stateId: any): Observable<city[]> {
    const parametros = { id: stateId };
    const url = `${this.baseUrl+this.endpointCity}`;
    return this.httpClient.post<city[]>(url, parametros);
  }

}
