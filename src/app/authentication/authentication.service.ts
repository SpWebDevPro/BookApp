import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataStorageService } from '../data-storage.service';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Step } from '../_Models/step.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthenticationService{

    baseUrl:string = environment.baseUrlApi;

    errorMessage:string;
    advise_errorMessage = new Subject<string>();
    
    successMessage:string;
    advise_successMessage = new Subject<string>();

    active_step_model:Step;
    validUntil:any

    login_status = new Subject<Boolean>();
    // user_email:string;


    constructor(
        private http:HttpClient,
        private dataStorageService:DataStorageService,
        private router:Router
    ){}
    
    
    getBaseUrl(){
        this.baseUrl = this.dataStorageService.myBrand.baseUrlApi;
    }

    registerUser(user){
        let url = `${this.baseUrl}/wp-json/wp/v2/users/register`
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let postData = {
            username:user.username,
            email:user.email,
            password:user.password
        };
        this.http
            .post(
            url,
            postData,
            httpOptions)
            .pipe(
                tap((response) => {
                    console.log(`response for ${url}:`, response)
                })
            )
            .subscribe((data) => {
                this.dataStorageService.dispatchIsLoadingStatus(false);
                this.successMessage = "Votre compte a bien été crée";
                this.dispatchSuccessInfos(this.successMessage);
            },
            error => {
                this.dataStorageService.dispatchIsLoadingStatus(false);
                console.log('error:', error);
                console.log('error.error.message:', error.error.message);
                switch(error.error.message) {
                    case "Username already exists, please enter another username":
                        this.errorMessage = "Un compte existe déjà avec cet identifiant"; 
                        break;
                    case "Email already exists, please try 'Reset Password'":
                        this.errorMessage = "Un compte existe déjà avec cet email"; 
                        break;
                    default:
                        this.errorMessage = "Une erreur s'est produite"; 
                }
                //this will pass the error to the components which have subscribed to it.
                this.dispatchErrorInfos(this.errorMessage);
                console.log('this.errorMessage:', this.errorMessage);
            })
    }

    logInUser(user){
        let url = `${this.baseUrl}/wp-json/jwt-auth/v1/token`
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let postData = {
            username:user.username,
            password:user.password
        };
        // console.log('postData', postData)
        this.http
            .post(
            url,
            postData,
            httpOptions)
            .pipe(
                tap((response) => {
                    console.log(`response for ${url}:`, response)
                })
            )
            .subscribe((data) => {
                //if token:              
                if(data['token']){
                    //aller au firststep
                    this.getFirstStep();
                    //récupérer le token, la duree de validité, le mail et le mettre en storage
                    this.setSession(data);
                    // this.setUserEmail(data);
                }
                this.isLoggedIn();
            },
            error => {
                console.log('error:', error);
                console.log('error.error.code:', error.error.code);
                switch(error.error.code) {
                    case "[jwt_auth] invalid_username":
                        this.errorMessage = "Identifiant erronné"; 
                        break;
                    case "[jwt_auth] too_many_retries":
                        this.errorMessage = "Trop de tentatives de connexion, réessayez ultérieurement"; 
                        break;
                    case "[jwt_auth] incorrect_password":
                        this.errorMessage = "Mot de passe erronné"; 
                        break;
                    case "jwt_auth_invalid_token":
                        this.errorMessage = "Votre connexion précédente est trop ancienne. Vous devez vous reconnecter";
                        //here will need to logout and redirect to user
                        // this.authenticationService.logOutUser();
                        break;
                    default:
                        this.errorMessage = "Une erreur s'est produite"; 
                }
                //this will pass the error to the components which have subscribe to it.
                this.dispatchErrorInfos(this.errorMessage);
                console.log('this.errorMessage:', this.errorMessage);
                this.dataStorageService.dispatchIsLoadingStatus(false);
            })
    }

    setSession(logInUserResult){
        localStorage.setItem('token', logInUserResult.token);
        localStorage.setItem('valid_until', JSON.stringify(logInUserResult.expiresIn));
        // this.validUntil = JSON.stringify(logInUserResult.expiresIn);
        localStorage.setItem('email',logInUserResult.user_email);
    }

    getJWTToken(){
        return localStorage.getItem('token');
    }

    getUserEmaillocalStorage(){
        return localStorage.getItem('email');
    }

    isJWTValid(){
        //compare the expiration date with now
        //this should be checked as soon as so launch the app to make sure it is disconnected when he/she starts
        let expirationDate = JSON.parse(localStorage.getItem('valid_until'));
        let exp = new Date(expirationDate*1000);
        let now = new Date();
        if (exp > now ){
            // console.log('ok, the token is still valid');
            return true
        } else {
            // console.log('token invalid');
            return false;
        }
    }

    // setUserEmail(userdata){
    //     this.user_email =  this.getUserEmaillocalStorage();
    // }

    logOutUser(){
        localStorage.removeItem('token');
        localStorage.removeItem('valid_until');
        localStorage.removeItem('email');
        this.isLoggedIn();
        //go to welcome page i/o authenticate
        this.router.navigate(['/welcome']);
        this.dataStorageService.displayNavButtonDiv(true);
    }

    isLoggedIn():boolean{
        if (localStorage.getItem('token') && (this.isJWTValid())){
            // console.log('the user is loggedIn');
            this.login_status.next(true);
            return true;
        }
        else {
            this.login_status.next(false);
            return false;
        }
    }

    getFirstStep(){
        this.dataStorageService.getFirstStepFromWP();
    }

    goToAuthenticate(){
        this.router.navigate(['/user']);
        this.dataStorageService.displayNavButtonDiv(true);
        this.dataStorageService.displayHeaderAndFooter(false);
    }

    //pass errorInfo to authentication Component
    dispatchErrorInfos(value:any){
        // console.log('je dispatch les infos erreurs');
        return this.advise_errorMessage.next(value);
    }

    //pass successInfo to authentication Component
    dispatchSuccessInfos(value:any){
        // console.log('je dispatch les infos succes');
        return this.advise_successMessage.next(value);
    }

    //if no network, this is the response in console.
    // TODO: to be handled:
    // for any request actually
    //     error: 
    //     vP {headers: nP, status: 504, statusText: "Gateway Timeout", url: "https://interesting-novelist.flywheelsites.com/wp-json/jwt-auth/v1/token", ok: false, …}
    // error: null
    // headers: nP {normalizedNames: Map(0), lazyUpdate: null, headers: Map(0)}
    // message: "Http failure response for https://interesting-novelist.flywheelsites.com/wp-json/jwt-auth/v1/token: 504 Gateway Timeout"
    // name: "HttpErrorResponse"
    // ok: false
    // status: 504
    // statusText: "Gateway Timeout"
    // url: "https://interesting-novelist.flywheelsites.com/wp-json/jwt-auth/v1/token"


}