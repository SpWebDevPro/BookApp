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
    apiWp = '/wp-json/apiBookApp';


    errorMessage:string;
    advise_errorMessage = new Subject<string>();
    
    successMessage:string;
    advise_successMessage = new Subject<string>();

    active_step_model:Step;
    validUntil:any

    login_status = new Subject<Boolean>();
    wantsToGoToUserAccount:Boolean = false; // will be set to true when user click on "mes RDV" in welcome page
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
            username:user.email,
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
                    // console.log(`response for ${url}:`, response)
                })
            )
            .subscribe((data) => {
                this.dataStorageService.dispatchIsLoadingStatus(false);
                this.successMessage = "Votre compte a bien été créé";
                this.dispatchSuccessInfos(this.successMessage);
            },
            error => {
                this.dataStorageService.dispatchIsLoadingStatus(false);
                // console.log('error:', error);
                // console.log('error.error.message:', error.error.message);
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
                // console.log('this.errorMessage:', this.errorMessage);
            })
    }

    logInUser(user){
        //il faudrait vérifier la validité du token avant de se connecter.et logout s'il est périmé.
        // ça doit être fait à l'ouvertue de l'app.
        let url = `${this.baseUrl}/wp-json/jwt-auth/v1/token`
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let postData = {
            username:user.email,
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
                    // console.log(`response for ${url}:`, response)
                })
            )
            .subscribe((data) => {
                //if token:              
                if(data['token']){
                    //récupérer le token, la duree de validité, le mail et le mettre en storage
                    this.setSession(data);
                    if ( this.wantsToGoToUserAccount){
                        this.goToUserAccount();
                    }
                    else {
                        this.getFirstStep();
                    }
                }
                this.isLoggedIn();
            },
            error => {
                // console.log('error:', error);
                // console.log('error.error.code:', error.error.code);
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
                        this.logOutUser();
                        break;
                    case "[jwt_auth] invalid_email":
                        this.errorMessage = "Email non valide"; 
                        break;
                    default:
                        this.errorMessage = "Une erreur s'est produite"; 
                }
                //this will pass the error to the components which have subscribe to it.
                this.dispatchErrorInfos(this.errorMessage);
                // console.log('this.errorMessage:', this.errorMessage);
                this.dataStorageService.dispatchIsLoadingStatus(false);
            })
    }

    askForNewPassword(user){
        let url = `${this.baseUrl}${this.apiWp}/customerAskResetPassword`;
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let postData = {
            email:user.email,
        };
        // console.log('postData:', postData);
        this.http
            .post(
            url,
            postData,
            httpOptions)
            .pipe(
                tap((response) => {
                    // console.log(`response for ${url}:`, response)
                })
            )
            .subscribe((data) => {
                // console.log('data:', data);
                switch(data['message']) {
                    case "Email inconnu, nous ne pouvons donner suite à votre demande":
                        this.errorMessage = "Email inconnu, nous ne pouvons donner suite à votre demande"; 
                        this.dispatchErrorInfos(this.errorMessage)
                        break;
                    case "Nous vous avons envoyé un email pour modifier votre mot de passe. La réception peut prendre quelques minutes":
                        this.successMessage = "Nous vous avons envoyé un mail pour modifier votre mot de passe. La réception peut prendre quelques minutes"; 
                        this.dispatchSuccessInfos(this.successMessage);
                        break;
                    case "400":
                        this.errorMessage = "Une erreur s'est produite";
                        this.dispatchErrorInfos(this.errorMessage)
                        break;
                    default:
                        this.errorMessage = "Une erreur s'est produite"; 
                        this.dispatchErrorInfos(this.errorMessage)
                }
            },
            error => {
                // this.dataStorageService.dispatchIsLoadingStatus(false);
                // console.log('error:', error);
                // console.log('error.error.message:', error.error.message);
                //switch(error.error.message) {
                    // case "Username already exists, please enter another username":
                    //     this.errorMessage = "Un compte existe déjà avec cet identifiant"; 
                    //     break;
                    // case "Email already exists, please try 'Reset Password'":
                    //     this.errorMessage = "Un compte existe déjà avec cet email"; 
                    //     break;
                    //default:
                        //this.errorMessage = "Une erreur s'est produite"; 
                //}
                // this will pass the error to the components which have subscribed to it.
                this.errorMessage = "Une erreur s'est produite"; 
                this.dispatchErrorInfos(this.errorMessage);
                // console.log('this.errorMessage:', this.errorMessage);
            })
    }
    
    confirmChangePassword(user){
        let url = `${this.baseUrl}${this.apiWp}/customerChangePassword`;
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let postData = {
            tokenPassword:user.tokenPassword,
            password:user.password,
            confirmedPassword:user.confirmedPassword
        };
        // console.log('postData:', postData);
        this.http
            .post(
            url,
            postData,
            httpOptions)
            .pipe(
                tap((response) => {
                    // console.log(`response for ${url}:`, response)
                })
            )
            .subscribe((data) => {
                // console.log('data:', data);
                switch(data['message']) {
                    case "Votre mot de passe a été mis à jour.":
                        this.successMessage = "Votre mot de passe a été mis à jour !"; 
                        this.dispatchSuccessInfos(this.successMessage);
                        break;
                    case "Erreur ! les mots de passe ne correspondent pas":
                        this.errorMessage = "Erreur ! les mots de passe ne correspondent pas"; 
                        this.dispatchErrorInfos(this.errorMessage);
                        break;
                    case "Clé secrète invalide":
                        this.errorMessage = "Clé secrète invalide";
                        this.dispatchErrorInfos(this.errorMessage);
                    default:
                        this.errorMessage = "Une erreur s'est produite"; 
                        this.dispatchErrorInfos(this.errorMessage);
                }
            },
            error => {
                // this.dataStorageService.dispatchIsLoadingStatus(false);
                // console.log('error:', error);
                // console.log('error.error.message:', error.error.message);
                // switch(error.error.message) {
                //     case "Username already exists, please enter another username":
                //         this.errorMessage = "Un compte existe déjà avec cet identifiant"; 
                //         break;
                //     case "Email already exists, please try 'Reset Password'":
                //         this.errorMessage = "Un compte existe déjà avec cet email"; 
                //         break;
                //     default:
                //         this.errorMessage = "Une erreur s'est produite"; 
                // }
                //this will pass the error to the components which have subscribed to it.
                this.errorMessage = "Une erreur s'est produite";
                this.dispatchErrorInfos(this.errorMessage);
                // console.log('this.errorMessage:', this.errorMessage);
            })
    }

    setSession(logInUserResult){
        localStorage.setItem('token', logInUserResult.token);
        localStorage.setItem('valid_until', JSON.stringify(logInUserResult.expiresIn));
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
            return true;
        } else {
            return false;
        }
    }

    logOutUser(){
        localStorage.removeItem('token');
        localStorage.removeItem('valid_until');
        localStorage.removeItem('email');
        // this.isLoggedIn();
        this.login_status.next(false);
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

    goToUserAccount(){
        this.router.navigate(['/useraccount']);
      }

    goToAuthenticate(AfterAuthenticateGoTo){
        if (AfterAuthenticateGoTo === 'useraccount'){
            this.wantsToGoToUserAccount = true;
        }
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