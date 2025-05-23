import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject, Injectable, InjectionToken } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

 
  constructor(private auth: AuthService,private router:Router) {
    
  }
  canActivate(): boolean {
    if(this.auth.isLogedin()){
      return true;
    }else{
      console.log("Please Login first");
      this.router.navigate(['login']);
      return false;

    }
  }

}