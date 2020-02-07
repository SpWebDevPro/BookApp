import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../_Models/step.model';
import { Subscription, Observable } from 'rxjs';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-service-offer',
  templateUrl: './service-offer.component.html',
  styleUrls: ['./service-offer.component.scss']
})
export class ServiceOfferComponent implements OnInit {

  state:any;
  stateChangeSub:Subscription;

  step:Step;
  vars_for_view:any;
  services:any;
  selectedCard:any;

  brand_company:string;

  errorAdviseMessage:Subscription;
  errorMessage:string = null;
  
  constructor(
    private dataStorageService:DataStorageService,
    private meta:Meta
  ) { }

  ngOnInit() {

    this.dataStorageService.displayNavButtonDiv(false);

    this.state = this.dataStorageService.getState();
    this.step = this.state.active_step_model;
    this.vars_for_view = this.state.vars_for_view;
    this.services = this.state.vars_for_view.services;

    this.stateChangeSub = this.dataStorageService.change_state.subscribe(
      (state) => { 
        this.state = state;
        this.step = this.state.active_step_model;
        this.vars_for_view = this.state.vars_for_view;
        this.services = this.state.vars_for_view.services;
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
  }

  onSelectCard(service){
    this.selectedCard = service;
    if (this.selectedCard) {
     this.dataStorageService.enableSelectedClass(this.selectedCard);
    }
    //ici on vérifie si le step is_first_step, and if so,
      if (this.state.is_first_step) {
        this.dataStorageService.disableNextBtn(false);
        this.dataStorageService.disablePrevBtn(true);
      }
      else {
        this.dataStorageService.disableNextBtn(false);
        this.dataStorageService.disablePrevBtn(false);
      }
    let bookDataToPass = {
      service_id:this.selectedCard.id
    }
    this.dataStorageService.collectBookingInfo(bookDataToPass);
  }

  ngOnDestroy():void {
    this.stateChangeSub.unsubscribe();
    this.errorAdviseMessage.unsubscribe();
  }

}
