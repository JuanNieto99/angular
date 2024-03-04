import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { Clientes, country, state, city } from '../../models/admin/clientes.model';
import { Config } from '../../storage/config';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

    private baseUrl: string;
    private endpointListar: string;
    private endpointClienteGet: string;
    private endpointClienteCreate: string;
    private endpointEliminar: string;
    private endpointClienteUpdate: string;
    private endpointCountry: string;
    private endpointState: string;
    private endpointCity: string;
    public data: Observable<Clientes[]>;
    private dataSubject: BehaviorSubject<Clientes[]>;

    constructor(private httpClient: HttpClient) {
        this.dataSubject = new BehaviorSubject<Clientes[]>([]);
        this.endpointListar = '/clientesListar';
        this.endpointClienteGet = '/clienteEditar/';
        this.endpointClienteCreate = '/clientesCrear';
        this.endpointClienteUpdate = '/clientesActualizar';
        this.endpointEliminar = '/clientesEliminar';
        this.endpointCountry = '/paisListar';
        this.endpointState = '/departamentoPaisListar';
        this.endpointCity = '/ciudadDepartamentoListar';
        this.data = this.dataSubject.asObservable();
        this.baseUrl = Config.url;
    }

    getAll(per_page:number, search:string = '', page:number = 1): Observable<Clientes[]> {
        const parametros = {};
        return this.httpClient.post<Clientes[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
    }

    getClientes(id:number): Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointClienteGet+id}`);
    }

    createClientes(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointClienteCreate}`, data);
    }

    updateClientes(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointClienteUpdate}`, data);
    }

    deleteClientes(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointEliminar}`, data);
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
