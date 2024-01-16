import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { typeRoom } from '../../models/dashboard/typeRoom.model';
import { Config } from '../../storage/config';
 
@Injectable({
  providedIn: 'root'
})
export class TypeRoomsService {
    private baseUrl: string;
    private endpointListar: string;
    public data: Observable<typeRoom[]>;
    private dataSubject: BehaviorSubject<typeRoom[]>;

    constructor(private httpClient: HttpClient) {
        this.dataSubject = new BehaviorSubject<typeRoom[]>([]);
        this.baseUrl = Config.url;
        this.endpointListar = '/tipoHabitacionListar';
        this.data = this.dataSubject.asObservable();
    }

    getAll(per_page:number, search:string = ''): Observable<typeRoom[]> {
        const parametros = {};
        return this.httpClient.post<typeRoom[]>(`${this.baseUrl+this.endpointListar}?per_page=${per_page}&search=${search}`, parametros);
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
}
