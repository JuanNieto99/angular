import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Inventory } from '../../models/dashboard/inventory.model';
import { Permit } from 'src/app/content/models/admin/permissions.model';
import { Wallet } from '../../models/admin/wallets.model';
import { Config } from '../../storage/config';

@Injectable({
    providedIn: 'root'
  })

  export class InventoryService{
    ///// Variables de endpoints  /////
    private baseUrl: string;
    private endpointListar: string;
    private endpointInventoryGet: string;
    private endpointInventoryUpdate:string;
    private endpointDelete:string;
    private endpointInventoryCreate: string;
    private dataSubject: BehaviorSubject<Inventory[]>;
    public data: Observable<Inventory[]>;

    constructor(private httpClient: HttpClient) {
        this.dataSubject = new BehaviorSubject<Inventory[]>([]);
        this.data = this.dataSubject.asObservable();
        this.baseUrl = Config.url;
        this.endpointInventoryCreate ='/inventarioCrear';
        this.endpointListar = '/inventarioListar';
        this.endpointInventoryGet = '/inventarioEditar/';
        this.endpointInventoryUpdate = '/inventarioActualizar';
        this.endpointDelete='/inventarioEliminar';
    }

    getAll(per_page:number, search:string = '', page:number = 1): Observable<Inventory[]> {
        const parametros = {};
        return this.httpClient.post<Inventory[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
    }

    getInventory(id:number): Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointInventoryGet+id}`);
    }

    createInventory(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointInventoryCreate}`, data);
    }

    updateInventory(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointInventoryUpdate}`, data);
    }

    deleteInventory(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointDelete}`, data);
    }

}
