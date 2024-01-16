import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsModule } from 'src/app/content/components/dashboard/products/products.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { Products } from 'src/app/content/models/dashboard/products.model';
import { AppComponent } from 'src/app/app.component';
import { Config } from '../../storage/config';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl: string;
  private endpointListar: string; 
  private endpointProductGet: string; 
  private endpointProductCreate: string; 
  private endpointEliminar: string; 
  private endpointProductUpdate: string;
  public data: Observable<Products[]>;
  private dataSubject: BehaviorSubject<Products[]>;

  constructor(
    private httpClient: HttpClient, 
    ) { 
    this.dataSubject = new BehaviorSubject<Products[]>([]);
    this.endpointListar = '/productoListar'; 
    this.endpointProductGet = '/productoEditar/'; 
    this.endpointProductCreate = '/productoCrear/'; 
    this.endpointProductUpdate = '/productoActualizar'; 
    this.endpointEliminar = '/productoEliminar'; 
    this.data = this.dataSubject.asObservable();
    this.baseUrl = Config.url;
  }

  getAll(per_page:number, search:string = ''): Observable<Products[]> {
    const parametros = {};
    return this.httpClient.post<Products[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&search=${search}`, parametros);
    
  }

  getProducto(id:number): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl+this.endpointProductGet+id}`); 
  }

  refreshUsersData(): void {
    this.getAll(30).subscribe(
        (response: any) => {
            this.dataSubject.next(response.data);
        },
        (error) => {
            console.log('Error: ', error);
        }
    );
  }

  createProduct(data:any){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointProductCreate}`, data);
  }

  eliminarProduct(data:any){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointEliminar}`, data);
  }

  updateProducto(data:any){
    return this.httpClient.post<any>(`${this.baseUrl+this.endpointProductUpdate}`, data);
  }


}
