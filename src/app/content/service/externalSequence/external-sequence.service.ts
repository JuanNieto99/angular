import { Injectable } from '@angular/core';
import { Config } from '../../storage/config';
import { Observable } from 'rxjs';
import { externalSequence } from '../../models/admin/externalSequence.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExternalSequenceService {

    private baseUrl: string;
    private endpointListar: string;
    private endpointExternalSequenceGet: string;
    private endpointExternalSequenceUpdate: string;
    private endpointExternalSequenceCreate: string;
    private endpointDelete: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = Config.url;
        this.endpointListar = '/secuenciaExternaListar';
        this.endpointExternalSequenceGet = '/secuenciaExternaEditar/';
        this.endpointExternalSequenceUpdate = '/secuenciaExternaActualizar';
        this.endpointExternalSequenceCreate = '/secuenciaExternaCrear';
        this.endpointDelete = '/secuenciaExternaEliminar/';
    }

    getAll(per_page:number, search:string = ''): Observable<externalSequence[]> {
         const httpOptions = {
             headers: new HttpHeaders({
               'Content-Type': 'application/json',
             })
           };
        const parametros = {};
        return this.httpClient.post<externalSequence[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&search=${search}`, parametros);
    }

    getExternalSequence(id:number): Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointExternalSequenceGet+id}`);
    }

    createExternalSequence(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointExternalSequenceCreate}`, data);
    }

    updateExternalSequence(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointExternalSequenceUpdate}`, data);
    }

    deleteExternalSequence(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointDelete}`, data);
    }
}
