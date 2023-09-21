import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './authService.service';

 
@Injectable()
export class AuthGuardService implements CanActivate {
 
    constructor(private _router:Router,private authServ:AuthService ) {
    }
 
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
 
      
        if (this.authServ.isValidUser)  {
            return true;
        } 
        return false;
    }
 
}