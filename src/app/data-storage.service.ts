import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { Step } from './_Models/step.model';
import { Router } from '@angular/router';
import { Booking } from './_Models/booking.model';
import { Restrictions } from './_Models/restrictions.model';
import { Brand } from './_Models/brand.model';
import { tap, map } from 'rxjs/operators';
import { Customer } from './_Models/customer.model';
import { HandlingErrorsComponent } from './handling-errors/handling-errors.component';
import { NbDialogService } from '@nebular/theme';
import { environment } from 'src/environments/environment';
import { dbService } from './indexeddb.service';
import { AuthenticationService } from './authentication/authentication.service';



@Injectable()
export class DataStorageService {

    myBrand = new Brand(environment.name,environment.welcome,'','',environment.baseUrlApi, environment.company, environment.appUrl)





    state:any;
    change_state = new Subject<Boolean>();

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
    advise_recieved_response_from_server = new Subject<any>();
    

    errorMessage:string;
    advise_errorMessage_ds = new Subject<string>();
    
    successMessage:string;
    advise_successMessage_ds = new Subject<string>();

    constructor(
        private http:HttpClient,
        private router:Router,
        private dialogService:NbDialogService,
        private dbService: dbService
    ){}

    
// ****functions related to display****

    // false : will display header and footer
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
        //console.log('i am in dispatchisloadingstatus');
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

    dispatchResponseReceived(value:any){
        return this.advise_recieved_response_from_server.next(value);
    }

    dispatchNewState(value:any){
        return this.change_state.next(value);
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
        this.displayHeaderAndFooter(false);
    }

    checkStepToDisplay(){
        if (this.active_step_model){
            return this.active_step_model;
        }
        else {
            // console.log('cannot get active_step_model');
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
        this.state = {
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
        return this.state;
    }

    setStateFromIdb(state){
        this.state = state;
        //advise components that the state has changed
        this.dispatchNewState(this.state);
        // console.log( "this.state has been updated in data storage:", this.state);
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
        if (fakeUrl === `${domain}${apiWp}/start` || fakeUrl === `${domain}${apiWp}/firstStep` || fakeUrl === `${domain}${apiWp}/test` || fakeUrl === `${domain}${apiWp}/listBookings` || fakeUrl === `${domain}${apiWp}/cancelBooking`){
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
                    //console.log(`response for ${url}:`, response)
                })
            )
            .subscribe( data => {
                // console.log('data:', data);
                },
                error => this.handleErrors(error)
            )
    }

    getStepDetailsfromWP(step_name, booking, restrictions, direction,customer){
        this.dispatchIsLoadingStatus(true);
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
        // console.log('postData :', postData);
        this.http
            .post(
                url,
                postData,
                httpOptions)
            .pipe(
                tap((response) => {
                    //console.log(`response for ${url}:`, response)
                })
            )
            .subscribe( receivedData => {
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
                    // console.log('restrictions:', this.restrictions);
                    this.step_name = data["step_name"];
                    this.active_step_model = this.GetStepModelFromStepName(data["step_name"]);
                    this.displayStep(this.checkStepToDisplay().name);
                    this.disableNextBtn(!this.show_next_btn);
                    this.disablePrevBtn(!this.show_prev_btn);
                    this.dispatchIsLoadingStatus(false);
                    if(this.is_pre_last_step){
                        this.changeBtnMenu('Terminer');
                    }
                },
                error => this.handleErrors(error)
                )
    
            }

    getFirstStepFromWP(){
        let url = this.getEndPointUrl('firstStep');
        return this.http
            .get(url)
            .pipe(
                tap((response) => {
                    //console.log(`response for ${url}:`, response)
                })
            )
            .subscribe( 
                receivedData => {
                    // let dataa = receivedData["data"];
                    // let data = dataa.data;
                    let data = receivedData["data"];
                    // this.dispatchResponseReceived(data);
                    this.show_next_btn = data["show_next_btn"];
                    this.show_prev_btn = data["show_prev_btn"];
                    this.is_first_step = data["is_first_step"];
                    this.is_last_step = data["is_last_step"];
                    this.is_pre_last_step = data["is_pre_last_step"];
                    this.vars_for_view = data["vars_for_view"];
                    this.booking = data["booking_object"];
                    this.customer = data["customer"];
                    this.step_name = data["step_name"];
                    this.active_step_model = this.GetStepModelFromStepName(this.step_name);
                    this.displayStep(this.active_step_model.name);
                    this.disablePrevBtn(true);
                    this.disableNextBtn(true);
                    this.dispatchIsLoadingStatus(false);

                },
                error => {
                    this.handleErrors(error);
                }
            )
    }
    
    getStepsModelsFromWP(){
        let url = this.getEndPointUrl('start');
        return this.http
            .get(url)
            .pipe(
                tap((response) => {
                    //console.log(`response for ${url}:`, response);
                })
            )
            .subscribe( receivedData => {
                let data = receivedData["data"];
                // quick fix to remove location in case it is created in backend, to avoid any bug
                //we will check if locations is in steps_models, and if, so will remove it
                // this.steps_models = data["steps_models"];
                let array = data["steps_models"];
                for ( let i=0; i< array.length; i++){
                    if (array[i]["name"] === 'locations') {
                        array.splice(i,1);
                    }
                    // console.log('array:', array);
                    // return array;
                }
                this.steps_models = array;
                // console.log('this steps_models', this.steps_models);
                this.active_step_model = this.steps_models[0];
                // console.log('this.active_step_model :', this.active_step_model);
                // this.dbService.addStepsToDataBase(this.steps_models);
                this.booking = data["booking"];
                // this.dbService.addBookingToDataBase(this.booking);
                this.restrictions = data["restrictions"];
                // this.dbService.addRestrictionToDataBase(this.restrictions);
                
                },
                error => this.handleErrors(error)
            )
    }

    getUserAccountDetails(){
        let url = this.getEndPointUrl('listBookings');
        return this.http
            .get(url)
            .pipe(
                tap((response) => {
                    // console.log(`response for ${url}:`, response);
                }),
            )
            .subscribe( receivedData => {
                let data = receivedData["data"];
                this.dispatchResponseReceived(data);
                },
                error => this.handleErrors(error)
            )
    }

    cancelBooking(id){
        let url = this.getEndPointUrl('cancelBooking');
        let postData = {
            id:id
        };
        let httpOptions = {
            headers : new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http
            .post(
                url,
                postData,
                httpOptions)
            .pipe(
                tap((response) => {
                    // console.log(`response for ${url}:`, response);
                })
            )
            .subscribe( receivedData => {
                this.dispatchSuccessInfos(receivedData);
                this.getUserAccountDetails();
                },
                error => {
                    this.handleErrors(error);
                }
            )
    }




    //pass errorInfo to suscribers Component
    dispatchErrorInfos(value:any){
        //console.log('je dispatch les infos erreurs');
        //this.dispatchIsLoadingStatus(false);
        return this.advise_errorMessage_ds.next(value);
    }

    //pass successInfo to suscribers Component
    dispatchSuccessInfos(value:any){
        // console.log('je dispatch les infos succes');
        //this.dispatchIsLoadingStatus(false);
        return this.advise_successMessage_ds.next(value);
    }


    //to be rework with the error message found and see if we can create a service handle error
    //that will gather all messages error, exepted for authentication
    // authentication must keep separated
    handleErrors(error){
        //console.log('error in handle error:', error);
        //console.log('error.status:', error.status);
        //console.log('error.error.code:', error.error.code);
                if(error.error.code){
                    switch(error.error.code) {
                        case "jwt_auth_invalid_token":
                            this.errorMessage = "Votre connexion précédente est trop ancienne. Vous devez vous reconnecter";
                            console.log('j envoie le message depuis data storage')//this.authService.logOutUser(); pas autorisé, pb de circular dependency
                            //this.router.navigate(['/user']);
                            break;
                        default:
                            this.errorMessage = "Une erreur s'est produite"; 
                    }
                }
                else {
                    if (error.status == 0 || error.status == 504){
                        this.errorMessage = "Service non disponible"; 
                    } else {
                        this.errorMessage = error.message;
                    }
                    
                }
                //this will pass the error to the components which have subscribe to it.
                this.dispatchErrorInfos(this.errorMessage);
                this.dispatchIsLoadingStatus(false);
                // console.log('this.errorMessage:', this.errorMessage);
    }

    //to be tested separatly
    openDialog(errMess,successMess){
        let dialogref;
        return dialogref = this.dialogService.open(HandlingErrorsComponent, {
          context: {
            errorMessageAuth:errMess,
            successMessageAuth:successMess
          },
          autoFocus:false
        });
      }



}