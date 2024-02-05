import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../storage/config';
import { tarifa } from '../../models/admin/tarifa.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private baseUrl: string;
  private endpointListar: string; 
  private endpointDelete: string;
  private endpointCrear: string;
  private endpointEdit: string;
  private endpointUpdate: string;
  private endpointEditGet: string;

  constructor(private httpClient: HttpClient) { 
    this.baseUrl = Config.url; 
    this.endpointListar = '/tarifaListar';
    this.endpointDelete = '/tarifaEliminar';
    this.endpointCrear = '/tarifaCrear/'; 
    this.endpointEditGet = '/tarifaEditar/';
    this.endpointUpdate = '/tarifaActualizar';
  }

  getAll(per_page:number, search:string = '', page:number = 1): Observable<tarifa[]> {
    const parametros = {};
    return this.httpClient.post<tarifa[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
  }

  getTarifas(id:number): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl+this.endpointEditGet+id}`);
  }

  create (data){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointCrear}`, data);
  }

  update (data){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointUpdate}`, data);
  }

  delete (data){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointDelete}`, data);
  }
}
