import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { Step } from './step.model';
import { Router } from '@angular/router';
import { Booking } from './booking.model';
import { Restrictions } from './restrictions.model';
import { Brand } from './brand.model';
import { tap } from 'rxjs/operators';
import { Customer } from './customer.model';
import { HandlingErrorsComponent } from './handling-errors/handling-errors.component';
import { NbDialogService } from '@nebular/theme';
import { environment } from 'src/environments/environment';



@Injectable()
export class DataStorageService {

    myBrand = new Brand(environment.name,environment.welcome,'','',environment.baseUrlApi, environment.company, environment.bye)

    //variables from backend
    steps_models:Step[];
    show_next_btn:Boolean = false;
    change_NextButtonDisabled = new Subject<Boolean>();
    show_prev_btn:Boolean = false;
    change_PrevButtonDisabled = new Subject<Boolean>();
    is_first_step:Boolean;
    is_last_step:Boolean;
    is_pre_last_step:Boolean;
    vars_for_view:any;

    //variables State to be returned with http POST call
    direction:string; //'next'/'prev'/'specific';
    updatedBooking: Booking;
    updatedCustomer:Customer;

    //variables from Backend, updated in front, and returned to backend with http POST call
    step_name:string;
    booking: Booking;
    customer:Customer;
    restrictions:Restrictions;
    
    //variables for internal communication between components
    active_step_model:Step;
    change_active_step_model = new Subject<Step>();
    change_headerAndFooterDisabled = new Subject<Boolean>();
    change_navButtonDisabled = new Subject<Boolean>();
    change_selected_card = new Subject<any>();
    selected_day:any;
    change_selected_day = new Subject<any>();
    change_month = new Subject<any>();
    is_Loading_data:Boolean;
    change_is_Loading_data = new Subject<Boolean>();
    change_btnMenu = new Subject<string>();

    errorMessage:string;
    advise_errorMessage_ds = new Subject<string>();
    
    successMessage:string;
    advise_successMessage_ds = new Subject<string>();

    constructor(
        private http:HttpClient,
        private router:Router,
        private dialogService:NbDialogService,
        // private authenticationService:AuthenticationService
    ){}

    
// ****functions related to display****


    displayHeaderAndFooter(value:Boolean) {
        return this.change_headerAndFooterDisabled.next(value);
    }

    // true : remove button menu ; false : display button menu
    displayNavButtonDiv(value:Boolean) {
        return this.change_navButtonDisabled.next(value);
    }

    disableNextBtn(value:Boolean){
        return this.change_NextButtonDisabled.next(value);
    }

    disablePrevBtn(value:Boolean){
        return this.change_PrevButtonDisabled.next(value);
    }

    changeBtnMenu(value:string){
        return this.change_btnMenu.next(value);
    }

    dispatchIsLoadingStatus(value:Boolean){
        return this.change_is_Loading_data.next(value);
    }

    enableSelectedClass(value:any){
        return this.change_selected_card.next(value);
    }

    //pass dayInfo to day-in-month
    dispatchSelectedDayInfos(value:any){
        if (value.dataTotalWorkMinutes !== 0){
            return this.change_selected_day.next(value);
        }
    }

    dispatchChangeMonth(value:any){
        return this.change_month.next(value);
    }

    GetStepModelFromStepName(stepName){
        for (let i=0; i<this.steps_models.length; i++){
            if (stepName == this.steps_models[i].name){
                return this.steps_models[i]
            }
        }
    }

    //redirect to the component matching the step
    displayStep(step){
        this.router.navigate([step]);
    }

    checkStepToDisplay(){
        if (this.active_step_model){
            return this.active_step_model;
        }
        else {
            console.log('cannot get active_step_model');
            // Do something
        }
    }

    //sera appelée du component avec le click bouton
    goToNextStep(direction){
        this.getStepDetailsfromWP(this.active_step_model.name, this.updatedBooking, this.restrictions, direction, this.updatedCustomer)
    }


// ****functions communication between components****

    //comunicate to componennt the data from the store at a given state
    getState(){
        let state = {
            show_next_btn:this.show_next_btn,
            show_prev_btn:this.show_prev_btn,
            is_first_step:this.is_first_step,
            is_last_step:this.is_last_step,
            is_pre_last_step:this.is_pre_last_step,
            vars_for_view:this.vars_for_view,
            booking: this.booking,
            customer:this.customer,
            restrictions:this.restrictions,
            active_step_model:this.active_step_model,
        };
        return state;
    }
    
    //communicate from component to the Store the changed datas with customer action
    collectBookingInfo(bookingDetails:any){
        // this.updatedBooking = this.booking;
        this.updatedBooking = new Booking(
           this.booking.id,
           this.booking.service_id,
           this.booking.customer_id,
           this.booking.agent_id,
           this.booking.location_id,
           this.booking.buffer_before,
           this.booking.buffer_after,
           this.booking.status,
           this.booking.start_date,
           this.booking.end_date,
           this.booking.start_time,
           this.booking.end_time,
           this.booking.payment_method,
           this.booking.payment_portion,
           this.booking.payment_token,
           this.booking.coupon_code,
           this.booking.duration,
           this.booking.price,
           this.booking.customer_comment,
           this.booking.updated_at,
           this.booking.created_at,
           this.booking.nice_names,
           this.booking.last_query,
           this.booking.meta,
           this.booking.table_name,
        )
        if(bookingDetails.service_id){
            this.updatedBooking.service_id = bookingDetails.service_id;
        }
        if(bookingDetails.agent_id){
            this.updatedBooking.agent_id = bookingDetails.agent_id;
        }
        if(bookingDetails.start_date){
            this.updatedBooking.start_date = bookingDetails.start_date;
        }
        if (bookingDetails.start_time){
            this.updatedBooking.start_time = bookingDetails.start_time;
        }
        //retreive the customer
        if (bookingDetails.customer){
            this.updatedCustomer = bookingDetails.customer;
        }
        if (bookingDetails.customer_id){
            this.updatedBooking.customer_id = bookingDetails.customer_id;
            this.updatedCustomer.id = bookingDetails.customer_id;
        }
    }

    getSelectedDay(day){
        this.selected_day = day;
        this.dispatchSelectedDayInfos(this.selected_day);
    }
    


// ****Calling API and getting back datas****

    //return the url for the http call, based on the route(=step) set as parameter
    getEndPointUrl(step_name:string){
        let domain = this.myBrand.baseUrlApi;
        let apiWp = '/wp-json/apiBookApp';
        let fakeUrl = `${domain}${apiWp}/${step_name}`;
        if (fakeUrl === `${domain}${apiWp}/start` || fakeUrl === `${domain}${apiWp}/firstStep` || fakeUrl === `${domain}${apiWp}/test`){
            return fakeUrl;
        }
        else {
            return `${domain}${apiWp}/loadStep`;
        }
    }

    getTest(){
        let url = this.getEndPointUrl('test');
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http
            .get(url, httpOptions)
            .pipe(
                tap((response) => {
                    console.log(`response for ${url}:`, response)})
            )
            .subscribe( data => {
                console.log('data:', data);
                },
                error => this.handleErrors(error)
            )
    }

    getStepDetailsfromWP(step_name, booking, restrictions, direction,customer){
        let url = this.getEndPointUrl(step_name);
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        let postData = {
            current_step:step_name,
            booking:booking,
            restrictions:restrictions,
            direction:direction,
            customer:customer,
        };
        this.http
            .post(
                url,
                postData,
                httpOptions)
            .pipe(
                tap((response) => {
                    console.log(`response for ${url}:`, response)})
            )
            .subscribe( receivedData => {
                    // let dataa = receivedData["data"];
                    // let data = dataa.data;
                    let data = receivedData["data"];
                    this.show_next_btn = data["show_next_btn"];
                    this.show_prev_btn = data["show_prev_btn"];
                    this.is_first_step = data["is_first_step"];
                    this.is_last_step = data["is_last_step"];
                    this.is_pre_last_step = data["is_pre_last_step"];
                    this.vars_for_view = data["vars_for_view"];
                    this.booking = data["booking_object"];
                    this.customer = data["customer"];
                    this.restrictions = data["restrictions"];
                    this.step_name = data["step_name"];
                    this.active_step_model = this.GetStepModelFromStepName(data["step_name"]);
                    this.displayStep(this.checkStepToDisplay().name);
                    this.disableNextBtn(!this.show_next_btn);
                    this.disablePrevBtn(!this.show_prev_btn);
                    if(this.is_pre_last_step){
                        this.changeBtnMenu('Terminer');
                    }
                },
                error => this.handleErrors(error)
                )
    }

    getFirstStepFromWP(){
        let url = this.getEndPointUrl('firstStep');
        // let httpOptions = {
        //     headers : new HttpHeaders({
        //         'Content-Type': 'application/json'
        //     })
        // }
        return this.http
            // .get(url, httpOptions)
            .get(url)
            .pipe(
                tap((response) => {
                    console.log(`response for ${url}:`, response)})
            )
            .subscribe( 
                receivedData => {
                    // let dataa = receivedData["data"];
                    // let data = dataa.data;
                    let data = receivedData["data"];
                    this.show_next_btn = data["show_next_btn"];
                    this.show_prev_btn = data["show_prev_btn"];
                    this.is_first_step = data["is_first_step"];
                    this.is_last_step = data["is_last_step"];
                    this.is_pre_last_step = data["is_pre_last_step"];
                    this.vars_for_view = data["vars_for_view"];
                    this.booking = data["booking_object"];
                    this.customer = data["customer"];
                    this.step_name = data["step_name"];
                    this.active_step_model = this.GetStepModelFromStepName(data["step_name"]);
                    this.displayStep(this.active_step_model.name);
                    this.disablePrevBtn(true);
                    this.disableNextBtn(true);
                    this.dispatchIsLoadingStatus(false);

                },
                error => this.handleErrors(error)
            )
    }
    
    getStepsModelsFromWP(){
        let url = this.getEndPointUrl('start');
        // let httpOptions = {
        //     headers : new HttpHeaders({
        //         'Content-Type': 'application/json',
        //     })
        // }
        return this.http
            // .get(url, httpOptions)
            .get(url)
            .pipe(
                tap((response) => {
                    console.log(`response for ${url}:`, response);
                })
            )
            .subscribe( receivedData => {
                // let dataa = receivedData["data"];
                // let data = dataa.data;
                let data = receivedData["data"];
                this.steps_models = data["steps_models"];
                this.booking = data["booking"];
                this.restrictions = data["restrictions"];
                },
                error => this.handleErrors(error)
            )
    }

    //pass errorInfo to suscribers Component
    dispatchErrorInfos(value:any){
        console.log('je dispatch les infos erreurs');
        return this.advise_errorMessage_ds.next(value);
    }

    //pass successInfo to suscribers Component
    dispatchSuccessInfos(value:any){
        console.log('je dispatch les infos succes');
        return this.advise_successMessage_ds.next(value);
    }


    //to be rework with the error message found and see if we can create a service handle error
    //that will gather all messages error, exepted for authentication
    // authentication must keep separated
    handleErrors(error){
        console.log('error:', error);
                console.log('error.error.code:', error.error.code);
                if(error.error.code){
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
                            // this.authenticationService.goToAuthenticate();
                            break;
                        default:
                            this.errorMessage = "Une erreur s'est produite"; 
                    }
                }
                else {
                    this.errorMessage = error.message;
                }
                //this will pass the error to the components which have subscribe to it.
                this.dispatchErrorInfos(this.errorMessage);
                console.log('this.errorMessage:', this.errorMessage);
    }

    //to be tested separatly
    openDialog(errMess,successMess){
        let dialogref;
        return dialogref = this.dialogService.open(HandlingErrorsComponent, {
          context: {
            errorMessageAuth:errMess,
            successMessageAuth:successMess
          },
        });
      }


//TODO : handle error quand le token est périmé
// GET https://interesting-novelist.flywheelsites.com/wp-json/apiBookApp/start 403
// data-storage.service.ts:397 error: HttpErrorResponse {headers: HttpHeaders, status: 403, statusText: "OK", url: "https://interesting-novelist.flywheelsites.com/wp-json/apiBookApp/start", ok: false, …}
// data-storage.service.ts:398 error.error.code: jwt_auth_invalid_token
// data-storage.service.ts:384 je dispatch les infos erreurs
// data-storage.service.ts:419 this.errorMessage: Une erreur s'est produit

//TODO
// //error: ProgressEvent {isTrusted: true, lengthComputable: false, loaded: 0, total: 0, type: "error", …}
// headers: aP {normalizedNames: Map(0), lazyUpdate: null, headers: Map(0)}
// message: "Http failure response for https://interesting-novelist.flywheelsites.com/wp-json/apiBookApp/start: 0 Unknown Error"
// name: "HttpErrorResponse"
// ok: false
// status: 0
// statusText: "Unknown Error"
// url: "https://interesting-novelist.flywheelsites.com/wp-json/apiBookApp/start"
// __proto__: hP

}