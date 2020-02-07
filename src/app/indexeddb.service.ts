import Dexie from 'dexie';
import { Injectable } from '@angular/core';
import { Navigation } from './navigation.model';
// import { Step } from './_Models/step.model';
// import { Service } from './_Models/service.model';
// import { Customer } from './_Models/customer.model';
// import { Booking } from './_Models/booking.model';
// import { Restrictions } from './_Models/restrictions.model';
// import { Agent } from './_Models/agent.model';

@Injectable()
export class dbService extends Dexie{

    // brand: Dexie.Table<Brand, number>;
    // steps: Dexie.Table<Step, number>;
    // booking: Dexie.Table<Booking, number>
    // restriction: Dexie.Table<Restrictions, number>
    // customer:Dexie.Table<Customer, string>;
    // services:Dexie.Table<Service, number>;
    // agents:Dexie.Table<Agent, number>;
    serverresponse:Dexie.Table<Navigation, any>;
    
    constructor(){
        super('dbService');
        this.version(5).stores({
            // steps: "order_number,id,name,order_number,icon_image_id,title,sub_title,use_custom_image,updated_at,created_at,description,nice_names,last_query,meta,table_name",
            // booking:"++bookingdbId,id,service_id,customer_id,agent_id,location_id,buffer_before,buffer_after,status,start_date,end_date,start_time,end_time,payment_method,payment_portion,payment_token,coupon_code,duration,price,customer_comment,updated_at,created_at,nice_names,last_query,meta,table_name",
            // restriction:"++restrictiondbId, show_locations,show_agents,show_services,show_service_categories,selected_location,selected_agent,selected_service,selected_service_category,calendar_start_date",
            // customer:"email,activation_key,admin_notes,avatar_image_id,created_at,email,facebook_user_id,first_name,google_user_id,id,is_guest,last_name,last_query,meta,nice_names,notes,password,phone,status,table_name,updated_at,account_nonse",
            // services:"++serviceIddbId,bg_color,buffer_after,buffer_before,category_id,charge_amount,color,created_at,deposit_amount,deposit_value,description_image_id,duration,id,is_custom_duration,is_custom_hours,is_custom_price,is_deposit_required,is_price_variable,last_query,meta,name,nice_names,order_number,price_max,price_min,selection_image_id,services_agents_table_name,short_description,status,table_name,timeblock_interval,updated_at,thumbnail_url",
            // agents:"++agentsdbId,created_at,description,icon_image_id,id,last_query,meta,name,nice_names,order_number,sub_title,table_name,title,updated_at,use_custom_image",
            serverresponse:"navigation_id, response"
        });
        // this.steps = this.table("steps");
        // this.booking = this.table("booking");
        // this.restriction = this.table("restriction");
        // this.customer = this.table("customer");
        // this.services = this.table("services");
        // this.agents = this.table("agents");
        this.serverresponse = this.table("serverresponse");
    }

    // returnStore(store:string){
    //     switch(store) {
    //         case "steps":
    //             return this.steps;
    //             break;
    //         case "booking":
    //             return this.booking;; 
    //             break;
    //         case "restriction":
    //             return this.restriction; 
    //             break;
    //         case "customer":
    //             return this.customer;
    //             break;
    //         case "services":
    //             return this.services;
    //             break;
    //         case "agents":
    //             return this.agents;
    //             break;
    //         case "serverresponse":
    //             return this.serverresponse;
    //             break;
    //     }
    // }

    findMatchIdInDB(id):Promise<any>{
        return this.transaction('r', this.serverresponse, () => {
            return this.serverresponse
            .get(id)
            .then( async(result) => {
                console.log('[localDB]: j\'ai trouvé un match pour l id:', id);
                console.log('result:', result);
                return result;
            })
            .catch( err => console.log('error when findMatchIdInDB:', err.stack || err));
        })
    }

    addServerResponseToDataBase(navigationObject:Navigation):Promise<any> {
        // console.log('navobj in addServer....', navigationObject);
        return this.transaction('rw', this.serverresponse, () => {
            this.serverresponse
            .put(navigationObject)
            .then( async() => {
                console.log('[localDB]: navigationObject saved');
            })
            .catch( err => console.log('error when addServerResponseToDataBase:', err.stack || err));
        })
    }

    clearStore(){
        this.serverresponse.clear();
        console.log('le store est clean!');
    }

    // addStepsToDataBase(steps:Step[]):Promise<any> {
    //     return this.transaction('rw', this.steps, ()=> {
    //         this.steps
    //         .bulkPut(steps)
    //         .then( async () => {
    //             console.log('[localDB]: steps saved');
    //         })
    //         .catch( err => console.log('error when addStepsToDataBase:', err.stack || err));
    //     })
    // }

    // addBookingToDataBase(booking:Booking):Promise<any> {
    //     return this.transaction('rw', this.booking, ()=> {
    //         this.booking
    //         .put(booking)
    //         .then ( async () => {
    //             console.log('[localDB]: booking saved')
    //         })
    //         .catch( err => console.log('error when addBookingToDataBase:', err.stack || err));
    //     })
    // }

    // addRestrictionToDataBase(restriction:Restrictions):Promise<any> {
    //     return this.transaction('rw', this.restriction, ()=> {
    //         this.restriction
    //         .put(restriction)
    //         .then ( async () => {
    //             console.log('[localDB]: restrictions saved')
    //         })
    //         .catch( err => console.log('error when addRestrictionsToDataBase:', err.stack || err));
    //     })
    // }

    // addCustomerToDataBase(customer:Customer):Promise<any> {
    //     return this.transaction('rw', this.customer, ()=> {
    //         this.customer
    //         .put(customer)
    //         .then ( async () => {
    //             console.log('[localDB]: customer saved')
    //         })
    //         .catch( err => console.log('error when addCustomerToDataBase:', err.stack || err));
    //     })
    // }

    // addServicesToDataBase(service:Service[]):Promise<any> {
    //     return this.transaction('rw', this.services, ()=> {
    //         this.services
    //         .bulkPut(service)
    //         .then( async () => {
    //             console.log('[localDB]: services saved');
    //         })
    //         .catch( err => console.log('error when addServicesToDataBase:', err.stack || err));
    //     })
    // }

    // addAgentsToDataBase(agent:Agent[]):Promise<any> {
    //     return this.transaction('rw', this.agents, ()=> {
    //         this.agents
    //         .bulkPut(agent)
    //         .then( async () => {
    //             console.log('[localDB]: agents saved');
    //         })
    //         .catch( err => console.log('error when addAgentsToDataBase:', err.stack || err));
    //     })
    // }


}