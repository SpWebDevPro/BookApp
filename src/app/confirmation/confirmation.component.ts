import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Subscription } from 'rxjs';
import { Step } from '../_Models/step.model';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  state:any;
  stateChangeSub:Subscription;

  booking_id:string;
  message_confirmation:string;
  step:Step;

  brand_company:string;
  brand_bye:string;

  errorAdviseMessage:Subscription;
  errorMessage:string = null;


  constructor(
    private dataStorageService:DataStorageService,
    private meta:Meta
  ) { }

  ngOnInit() {

    this.dataStorageService.displayNavButtonDiv(true);
    
    this.state = this.dataStorageService.getState();
    this.step = this.state.active_step_model;
    this.booking_id = this.state.booking.id;

    this.stateChangeSub = this.dataStorageService.change_state.subscribe(
      (state) => { 
        this.state = state;
        this.step = this.state.active_step_model;
        this.booking_id = this.state.booking.id;
    });

    this.brand_company = this.dataStorageService.myBrand.company;
    // this.brand_bye = this.dataStorageService.myBrand.bye;
    this.meta.addTags([
      { name:'description',content:`${this.step.sub_title}`},
      { name:'author',content:`${this.brand_company}`}
    ])

    this.errorAdviseMessage = this.dataStorageService.advise_errorMessage_ds.subscribe(
      (error) => {
        this.dataStorageService.openDialog(error, null);
        this.errorMessage = error;
      });

    if (this.booking_id){
      this.message_confirmation = this.step.description;
    }
    else {
      this.message_confirmation = "une erreur est survenue, veuillez re-essayer ultérieurement";
    }
  }

  ngOnDestroy():void {
    this.stateChangeSub.unsubscribe();
    this.errorAdviseMessage.unsubscribe();
  }
   

}
