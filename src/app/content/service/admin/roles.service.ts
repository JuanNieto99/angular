import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Rol } from 'src/app/content/models/admin/roles.model';
import { Config } from '../../storage/config';

@Injectable({
    providedIn: 'root'
  })

  export class RolesService{
    ///// Variables de endpoints  /////
    private baseUrl: string;
    private endpointRolListar:string;
    private endpointRolesMostrar:string;
    private endpointRolActualizar:string;
    private endpointRolEliminar:string;
    private endpointCrear: string;

    /////// Variables para manejar datos de permisos
    private dataSubject: BehaviorSubject<Rol[]>;
    public data: Observable<Rol[]>;

    constructor(private httpClient: HttpClient) {
        this.dataSubject = new BehaviorSubject<Rol[]>([]);
        this.data = this.dataSubject.asObservable();
        this.baseUrl = Config.url;
        this.endpointCrear ='/rolCrear';
        this.endpointRolListar = '/rolListar';
        this.endpointRolesMostrar = '/rolMostrar';
        this.endpointRolActualizar = '/rolActualizar';
        this.endpointRolEliminar='/rolEliminar';
    }

    //////////////////////  CRUD PERMISOS  /////////////////////////
    // Consultar lista de permisos
    getRoles(per_page:number):Observable<Rol[]>{
        const parametros = { 
            id: '',
            nombre: '',
            descripcion: '',
            estado: ''
        };
        return this.httpClient.post<Rol[]>(`${this.baseUrl+this.endpointRolListar}?per_page=${per_page}`, parametros);
    }
    // Crear un nuevo servicio
    CreateRoles(data: any): Observable<Rol[]> {
        return this.httpClient.post<Rol[]>(`${this.baseUrl+this.endpointCrear}`, data);
    }
    /////// Elegir un nuevo servicio por id
    getRolesById(id: number){
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointRolesMostrar}/${id}`)
              .pipe(map(hotel => hotel));
    }
     updateRoles(data:any): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointRolActualizar}`, data);
    }
    deleteRoles(id:number){
        const parametros = { 
            id: id
        };
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointRolEliminar}`, parametros);
    }
    refresRolesData(): void {
        this.getRoles(30).subscribe(
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