import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Permit } from 'src/app/content/models/admin/permissions.model';
import { Config } from '../../storage/config';
@Injectable({
    providedIn: 'root'
  })

  export class PermissionsService{
    ///// Variables de endpoints  /////
    private baseUrl: string;
    private endpointPListar:string;
    private endpointPMostrar:string;
    private endpointPActualizar:string;
    private endpointPEliminar:string;
    private endpointCrear: string;

    /////// Variables para manejar datos de permisos
    private dataSubject: BehaviorSubject<Permit[]>;
    public data: Observable<Permit[]>;

    constructor(private httpClient: HttpClient) {
        this.dataSubject = new BehaviorSubject<Permit[]>([]);
        this.data = this.dataSubject.asObservable();
        this.baseUrl = Config.url;
        this.endpointCrear ='/permisoCrear';
        this.endpointPListar = '/permisoListar';
        this.endpointPMostrar = '/permisoMostrar';
        this.endpointPActualizar = '/permisoActualizar';
        this.endpointPEliminar='/permisoEliminar';
    }

    //////////////////////  CRUD PERMISOS  /////////////////////////
    // Consultar lista de permisos
    getPermissions(per_page:number, search:string = '',page: number = 1):Observable<Permit[]>{
        const parametros = { 
            id: '',
            codigo: '',
            nombre: '',
            descripcion: '',
            id_padre: '',
            estado: ''
        };
        return this.httpClient.post<Permit[]>(`${this.baseUrl+this.endpointPListar}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
    }
    // Crear un nuevo servicio
    CreatePermissions(data: any): Observable<Permit[]> {
        return this.httpClient.post<Permit[]>(`${this.baseUrl+this.endpointCrear}`, data);
    }
    /////// Elegir un nuevo servicio por id
    getPermissionById(id: number){
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointPMostrar}/${id}`)
            .pipe(map(hotel => hotel));
    }
    updatePermissions(data:any): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointPActualizar}`, data);
    }
    deletePermissions(id:number){
        const parametros = { 
            id: id
        };
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointPEliminar}`, parametros);
    }
    refresPermissionData(): void {
        this.getPermissions(30).subscribe(
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