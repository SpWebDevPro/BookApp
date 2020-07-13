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

  navigator_var:any;
  displayShareBtn:Boolean;
  // displayShareBtn:Boolean = true;

  brand_company:string;
  // brand_bye:string;
  brand_Name_Application:string;
  brand_welcome_message:string;
  brand_url:string;

  errorAdviseMessage:Subscription;
  errorMessage:string = null;

  //isLoading:Boolean;


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

    //this.isLoading = true;

    this.brand_company = this.dataStorageService.myBrand.company;
    this.brand_Name_Application = this.dataStorageService.myBrand.name;
    this.brand_welcome_message = this.dataStorageService.myBrand.welcome;
    this.brand_url = this.dataStorageService.myBrand.appUrl;
    this.meta.addTags([
      { name:'description',content:`${this.step.sub_title}`},
      { name:'author',content:`${this.brand_company}`}
    ])

    this.errorAdviseMessage = this.dataStorageService.advise_errorMessage_ds.subscribe(
      (error) => {
        this.dataStorageService.openDialog(error, null);
        this.errorMessage = error;
      });

    this.navigator_var = window.navigator;
    if ( this.navigator_var && this.navigator_var.share){
      // console.log('fonctionnalité de partage supportée');
      this.displayShareBtn = true;
    }


    if (this.booking_id){
      //this.isLoading = false;
      this.message_confirmation = this.step.description;
      this.dataStorageService.changeBtnMenu("Continuer");
    }
    else {
      this.message_confirmation = "une erreur est survenue, veuillez re-essayer ultérieurement";
    }
  }

  shareApp(){
    // console.log('je vais share l app');
    if ( this.navigator_var && this.navigator_var.share){
    this.navigator_var.share({
      title: this.brand_Name_Application,
      text: this.brand_welcome_message,
      url:this.brand_url,
    })
    .then(()=> console.log('Merci d\'avoir partagé'))
    .catch((error) => console.log('erreur de partage :', error))
    }
  }




  ngOnDestroy():void {
    this.stateChangeSub.unsubscribe();
    this.errorAdviseMessage.unsubscribe();
  }
   

}
