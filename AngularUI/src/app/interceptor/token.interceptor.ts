import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken=localStorage.getItem('token');
    console.log(this.auth.getToken());
    if(myToken){
      request=request.clone({
        
        setHeaders:{Authorization:`Bearer ${localStorage.getItem('token')}`}// Bearer +myToken
      });
      
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status===401){
           
            this.router.navigate(['login'])
          }
        }

        return throwError(()=>new Error("Some other error occured"))
      })
    );
  }
}
