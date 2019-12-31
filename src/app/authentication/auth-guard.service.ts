import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private authenticationService:AuthenticationService,
        private router:Router
    ){}
    
    canActivate(route:ActivatedRouteSnapshot, routerstate:RouterStateSnapshot):boolean | Observable<boolean> {
        if (this.authenticationService.isLoggedIn()){
            // console.log('tu as le droit de naviguer')
            return true;
        } else {
            // console.log('tu n as pas le droit de naviguer!!!')
            this.router.navigate(['/welcome']);
            return false;
        }
    }
}