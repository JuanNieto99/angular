import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { Permit } from 'src/app/content/models/admin/permissions.model';
import { Wallet } from '../../models/admin/wallets.model';
import { Config } from '../../storage/config';

@Injectable({
    providedIn: 'root'
  })

  export class WalletService{
    ///// Variables de endpoints  /////
    private baseUrl: string;
    private endpointPListar:string;
    private endpointPMostrar:string;
    private endpointPActualizar:string;
    private endpointPEliminar:string;
    private endpointCrear: string;
    private endpointAbrirCaja: string;
    private endpointEdit: string;
    private endpointCerrarCaja: string;
    private endpointGetAbrirCaja: string;
    private endpointGetDetalleCaja: string;
    private endpointAnularCaja: string;
    /////// Variables para manejar datos de permisos
    private dataSubject: BehaviorSubject<Wallet[]>;
    public data: Observable<Wallet[]>;

    constructor(private httpClient: HttpClient) {
        this.dataSubject = new BehaviorSubject<Permit[]>([]);
        this.data = this.dataSubject.asObservable();
        this.baseUrl = Config.url;
        this.endpointCrear ='/cajaCrear';
        this.endpointPListar = '/cajaListar';
        this.endpointPMostrar = '/cajaMostrar';
        this.endpointPActualizar = '/cajaActualizar';
        this.endpointPEliminar='/cajaEliminar';
        this.endpointEdit='/cajaEditar';
        this.endpointGetAbrirCaja = '/getAbrirCaja/';
        this.endpointAbrirCaja = '/cajaAbir';
        this.endpointGetDetalleCaja = '/cajaDetalleListar';
        this.endpointCerrarCaja = '/cajaCerrar';
        this.endpointAnularCaja = '/cajaControlEliminar';
    }

    getAbrirCaja(usuario_id:number): Observable<any> {
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointGetAbrirCaja+usuario_id}`);
    }

    abrirCaja(data: any) : Observable<any> {
        return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointAbrirCaja}`, data);
    }

    //////////////////////  CRUD PERMISOS  /////////////////////////
    // Consultar lista de permisos
    getWallets(per_page:number):Observable<Wallet[]>{
        const parametros = { 
            nombre: '',
            descripcion: '',
            base: '',
            estado: '',
            hotel_id:''
        };
        return this.httpClient.post<Wallet[]>(`${this.baseUrl+this.endpointPListar}?per_page=${per_page}`, parametros);
    }
    // Crear un nuevo servicio
    CreateWallet(data: any): Observable<Wallet[]> {
        return this.httpClient.post<Wallet[]>(`${this.baseUrl+this.endpointCrear}`, data);
    }
    /////// Elegir un nuevo servicio por id
    getWalletById(id: number){
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointPMostrar}/${id}`)
            .pipe(map(hotel => hotel));
    }

    getWallteEditById(id: number){
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointEdit}/${id}`)
            .pipe(map(hotel => hotel));
    }
    updateWallets(data:any): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointPActualizar}`, data);
    }
    deleteWallets(id:number){
        const parametros = { 
            id: id
        };
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointPEliminar}`, parametros);
    }
    refresWalletsData(): void {
        this.getWallets(30).subscribe(
            (response: any) => {
                console.log(response.data);
                this.dataSubject.next(response.data);
            },
            (error) => {
                console.log('Error: ', error);
            }
        );  
    } 

    getAllDetalleCaja(per_page:number, search:string = '', page:number = 1): Observable<any[]> {
        const parametros = {};
        return this.httpClient.post<any[]>(`${this.baseUrl+this.endpointGetDetalleCaja}?per_page=${per_page}&page=${page}&search=${search}`, parametros);
    }

    cerrarCaja(data:any): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointCerrarCaja}`, data);
    }

    anularCaja(data:any): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointAnularCaja}`, data);
    }
}