import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../storage/config';
import { Observable } from 'rxjs';
import { internalSequence } from '../../models/dashboard/internalSequence.model';

@Injectable({
  providedIn: 'root'
})
export class InternalSequenceService {
    private baseUrl: string;
    private endpointListar: string;
    private endpointInternalSequenceGet: string;
    private endpointInternalSequenceUpdate: string;
    private endpointInternalSequenceCreate: string;
    private endpointDelete: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = Config.url;
        this.endpointListar = '/secuenciaInternaListar';
        this.endpointInternalSequenceGet = '/secuenciaInternaEditar/';
        this.endpointInternalSequenceUpdate = '/secuenciaInternaActualizar/';
        this.endpointInternalSequenceCreate = '/secuenciaInternaCrear';
        this.endpointDelete = '/secuenciaInternaEliminar/';
    }

    getAll(per_page:number, search:string = ''): Observable<internalSequence[]> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };
        const parametros = {};
        return this.httpClient.post<internalSequence[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&search=${search}`, httpOptions);
    }

    getInternalSequence(id:number): Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointInternalSequenceGet+id}`);
    }
}
