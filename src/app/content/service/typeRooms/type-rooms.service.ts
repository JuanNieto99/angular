import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { typeRoom } from '../../models/dashboard/typeRoom.model';
import { Config } from '../../storage/config';

@Injectable({
  providedIn: 'root'
})
export class TypeRoomsService {
    private baseUrl: string;
    private endpointListar: string;
    private endpointTypeRoomGet: string;
    private endpointTypeRoomUpdate: string;
    private endpointTypeRoomCreate: string;
    private endpointDelete: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = Config.url;
        this.endpointListar = '/tipoHabitacionListar';
        this.endpointTypeRoomGet = '/tipoHabitacionEditar/';
        this.endpointTypeRoomUpdate = '/tipoHabitacionActualizar/';
        this.endpointTypeRoomCreate = '/tipoHabitacionCrear';
        this.endpointDelete = '/tipoHabitacionEliminar/';
    }

    getTypeRoom(id:number): Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointTypeRoomGet+id}`);
    }

    getAll(per_page:number, search:string = '', page:number = 1): Observable<typeRoom[]> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };
        const parametros = {};
        return this.httpClient.post<typeRoom[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&page=${page}&search=${search}`, httpOptions);
    }

    createProduct(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointTypeRoomCreate}`, data);
    }

    updateTypeRoom(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointTypeRoomUpdate}`, data);
    }

    deleteTypeRoom(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointDelete}`, data);
    }
}
