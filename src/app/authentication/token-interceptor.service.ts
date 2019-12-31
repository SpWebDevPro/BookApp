
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authenticationService:AuthenticationService){  
    }

    intercept(request:HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>>{
        if (this.authenticationService.getJWTToken()){
            request = this.addToken( request,this.authenticationService.getJWTToken() )
        }
        return next.handle(request);
    }

    private addToken(request:HttpRequest<any>, token:string){
        return request.clone({
            setHeaders:  {
                'Authorization': `Bearer ${token}`
            }
        })
    }

}