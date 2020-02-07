import { Component, OnInit, Input } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../_Models/step.model';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-agent-offer',
  templateUrl: './agent-offer.component.html',
  styleUrls: ['./agent-offer.component.scss']
})
export class AgentOfferComponent implements OnInit {

  state:any;
  stateChangeSub:Subscription;

  step:Step;
  vars_for_view:any;
  agents:any;
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
    this.stateChangeSub = this.dataStorageService.change_state.subscribe(
      (state) => { 
        this.state = state;
        this.step = this.state.active_step_model;
        this.vars_for_view = this.state.vars_for_view;
        this.agents = this.state.vars_for_view.agents;
      });
    this.step = this.state.active_step_model;
    this.vars_for_view = this.state.vars_for_view;
    this.agents = this.state.vars_for_view.agents;
    this.brand_company = this.dataStorageService.myBrand.company;
    this.errorAdviseMessage = this.dataStorageService.advise_errorMessage_ds.subscribe(
      (error) => {
        this.dataStorageService.openDialog(error, null);
        this.errorMessage = error;
      });
    this.meta.addTags([
      { name:'description',content:`${this.step.sub_title}`},
      { name:'author',content:`${this.brand_company}`}
    ])
  }

  onSelectCard(agent){
    this.selectedCard = agent;
    this.dataStorageService.disableNextBtn(false);
    this.dataStorageService.disablePrevBtn(false);
    let bookDataToPass = {
      agent_id:this.selectedCard.id
    };
    this.dataStorageService.collectBookingInfo(bookDataToPass);
  }

  ngOnDestroy():void {
    this.stateChangeSub.unsubscribe();
    this.errorAdviseMessage.unsubscribe();
  }

}
