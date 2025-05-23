import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string ="https://localhost:7077/api/User/"
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private http: HttpClient,private router:Router) { }

  signUp(userObj:any){
    return this.http.post<any>(`${this.baseUrl}register`,userObj);
  }
  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj);
  }

  storeToken(tokenValue:string){
     
    localStorage.setItem('token',tokenValue);
    console.log(localStorage.getItem('token'));
    
  }
  getToken(){
    
    localStorage.getItem('token');
   
  }
  isLogedin():boolean{
    return !!localStorage.getItem('token');
 
  }
  signOut(){
    localStorage.clear();
   
    this.router.navigate(['login']);
  }
}
