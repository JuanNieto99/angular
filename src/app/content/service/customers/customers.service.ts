import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../storage/config';
import { Observable } from 'rxjs';
import { customers } from '../../models/admin/customers.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private baseUrl: string;
  private endpointListar: string;
  private endpointCustomersGet: string;
  private endpointCustomersUpdate: string;
  private endpointCustomersCreate: string;
  private endpointDelete: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = Config.url;
    this.endpointListar = '/clientesListar';
    this.endpointCustomersGet = '/clienteEditar/';
    this.endpointCustomersUpdate = '/clientesActualizar';
    this.endpointCustomersCreate = '/clientesCrear';
    this.endpointDelete = '/clientesEliminar/';
    
  } 

  getAll(per_page:number, search:string = '', page:number = 1): Observable<customers[]> {
    const parametros = {};
    return this.httpClient.post<customers[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
  }

  getCustomers(id:number): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl+this.endpointCustomersGet+id}`);
  }

  createCustomers(data:any){
      return this.httpClient.post<any>(`${this.baseUrl+this.endpointCustomersCreate}`, data);
  }

  updateInternalSequence(data:any){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointCustomersUpdate}`, data);
  }

  deleteInternalSequence(data:any){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointDelete}`, data);
  }

}
