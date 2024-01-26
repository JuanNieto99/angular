import { Injectable } from '@angular/core';
import { Config } from '../../storage/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Recipes } from '../../models/admin/recipes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
    private baseUrl: string;
    private endpointListar: string;
    private endpointRecipesGet: string;
    private endpointRecipesUpdate: string;
    private endpointRecipesCreate: string;
    private endpointDelete: string;

    constructor(private httpClient: HttpClient) {
        this.baseUrl = Config.url;
        this.endpointListar = '/recetaListar';
        this.endpointRecipesGet = '/recetaEditar/';
        this.endpointRecipesUpdate = '/recetaActualizar/';
        this.endpointRecipesCreate = '/recetaCrear';
        this.endpointDelete = '/recetaEliminar/';
    }

    getAll(per_page:number, search:string = '', page:number = 1): Observable<Recipes[]> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
        };
        const parametros = {};
        return this.httpClient.post<Recipes[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&page=${page}&search=${search}`, httpOptions);
    }

    getRecipes(id:number): Observable<any>{
        return this.httpClient.get<any>(`${this.baseUrl+this.endpointRecipesGet+id}`);
    }

    createRecipes(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointRecipesCreate}`, data);
    }

    updateRecipes(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointRecipesUpdate}`, data);
    }

    deleteRecipes(data:any){
        return this.httpClient.post<any>(`${this.baseUrl+this.endpointDelete}`, data);
    }
}
