import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { rooms } from '../../models/admin/rooms.model';
import { Config } from '../../storage/config';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
    private baseUrl: string;
    private endpointListar: string;
    private endpointRoomsGet: string;
    private endpointRoomsUpdate: string;
    private endpointRoomsCreate: string;
    private endpointDelete: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = Config.url;
        this.endpointListar = '/habitacionesListar';
        this.endpointRoomsGet = '/habitacionesEditar/';
        this.endpointRoomsUpdate = '/habitacionesActualizar';
        this.endpointRoomsCreate = '/habitacionesCrear';
        this.endpointDelete = '/habitacionesEliminar/';
    }

    getAll(per_page:number, search:string = '', page:number = 1): Observable<rooms[]> {
        const parametros = {};
        return this.httpClient.post<rooms[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
    }

    getRooms(id:number): Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointRoomsGet+id}`);
    }

    createRooms(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointRoomsCreate}`, data);
    }

    updateRooms(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointRoomsUpdate}`, data);
    }

    deleteRooms(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointDelete}`, data);
    }
}
