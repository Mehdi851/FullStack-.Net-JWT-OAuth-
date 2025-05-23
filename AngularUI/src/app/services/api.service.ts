import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
private baseUrl:string ="https://localhost:7077/api/User/"
  constructor(private http:HttpClient) { }

  getUsers(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}GetAllUser`);
  }
}
