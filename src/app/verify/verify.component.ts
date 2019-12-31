import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../step.model';
import { Booking } from '../booking.model';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  state:any;
  step:Step;
  vars_for_view:any;
  booking:Booking;
  bookingHour:string;

  brand_company:string;

  errorAdviseMessage:Subscription;
  errorMessage:string = null;

  constructor( 
    private dataStorageService:DataStorageService,
    private meta:Meta
    ) { }

  ngOnInit() {
    this.state = this.dataStorageService.getState();
    this.step = this.state.active_step_model;
    this.vars_for_view = this.state.vars_for_view;
    this.brand_company = this.dataStorageService.myBrand.company;
    // console.log('this.vars_for_view from verify cpt:', this.vars_for_view);
    // console.log('location.name', this.vars_for_view.location.name);
    // console.log('agent.first_name:', this.vars_for_view.agent.first_name);
    this.booking = this.state.booking;
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
  }

  

}
