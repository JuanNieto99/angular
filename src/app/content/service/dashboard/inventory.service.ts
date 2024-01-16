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
    private endpointPListar:string;
    private endpointPMostrar:string;
    private endpointPActualizar:string;
    private endpointPEliminar:string;
    private endpointCrear: string;

    /////// Variables para manejar datos de permisos
    private dataSubject: BehaviorSubject<Inventory[]>;
    public data: Observable<Inventory[]>;

    constructor(private httpClient: HttpClient) {
        this.dataSubject = new BehaviorSubject<Permit[]>([]);
        this.data = this.dataSubject.asObservable();
        this.baseUrl = Config.url;
        this.endpointCrear ='/inventarioCrear';
        this.endpointPListar = '/inventarioListar';
        this.endpointPMostrar = '/inventarioMostrar';
        this.endpointPActualizar = '/inventarioActualizar';
        this.endpointPEliminar='/inventarioEliminar';
    }

    //////////////////////  CRUD PERMISOS  /////////////////////////
    // Consultar lista de Inventarios
    getInventories(per_page:number):Observable<Inventory[]>{
        const parametros = { 
            nombre: '',
            descripcion: '',
            estado: '',
            hotel_id:''
        };
        return this.httpClient.post<Inventory[]>(`${this.baseUrl+this.endpointPListar}?per_page=${per_page}`, parametros);
    }
    // Crear un nuevo servicio
    createInventory(data: any): Observable<Inventory[]> {
        return this.httpClient.post<Inventory[]>(`${this.baseUrl+this.endpointCrear}`, data);
    }
    /////// Elegir un nuevo servicio por id
    getInventoryById(id: number){
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointPMostrar}/${id}`)
              .pipe(map(hotel => hotel));
    }
    updateInventory(data:any): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointPActualizar}`, data);
    }
    deleteInventry(id:number){
        const parametros = { 
            id: id
        };
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointPEliminar}`, parametros);
    }
    refresInventaryData(): void {
        this.getInventories(30).subscribe(
            (response: any) => {
              console.log(response.data);
                this.dataSubject.next(response.data);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );  
      } 
  }