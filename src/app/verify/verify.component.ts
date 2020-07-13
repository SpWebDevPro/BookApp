import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../_Models/step.model';
import { Booking } from '../_Models/booking.model';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  state:any;
  stateChangeSub:Subscription;

  step:Step;
  vars_for_view:any;
  booking:Booking;
  bookingHour:string;

  brand_company:string;

  errorAdviseMessage:Subscription;
  errorMessage:string = null;

  isLoadingStatus:Subscription;
  isLoading:Boolean = false;

  constructor( 
    private dataStorageService:DataStorageService,
    private meta:Meta
    ) { }

  ngOnInit() {

    this.state = this.dataStorageService.getState();
    this.step = this.state.active_step_model;
    this.vars_for_view = this.state.vars_for_view;
    this.booking = this.state.booking;
    
    this.stateChangeSub = this.dataStorageService.change_state.subscribe(
      (state) => { 
        this.state = state;
        this.step = this.state.active_step_model;
        this.vars_for_view = this.state.vars_for_view;
        this.booking = this.state.booking;
    });

    this.brand_company = this.dataStorageService.myBrand.company;
    this.meta.addTags([
      { name:'description',content:`${this.step.sub_title}`},
      { name:'author',content:`${this.brand_company}`}
    ])

    this.errorAdviseMessage = this.dataStorageService.advise_errorMessage_ds.subscribe(
      (error) => {
        this.dataStorageService.openDialog(error, null);
        this.errorMessage = error;
      });

    let bookDataToPass = {
      customer_id:this.vars_for_view.customer.id
    }
    this.dataStorageService.collectBookingInfo(bookDataToPass);
    this.isLoadingStatus = this.dataStorageService.change_is_Loading_data.subscribe(
      status => this.isLoading = status);
  }

  ngOnDestroy():void {
    this.stateChangeSub.unsubscribe();
    this.errorAdviseMessage.unsubscribe();
    this.isLoadingStatus.unsubscribe();
  }

}
