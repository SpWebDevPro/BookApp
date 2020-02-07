import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../_Models/step.model';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-slot-picker',
  templateUrl: './slot-picker.component.html',
  styleUrls: ['./slot-picker.component.scss'],
})
export class SlotPickerComponent implements OnInit {

  selectedItem = '';
  showAvailableHours:Boolean = false;

  btnMonthPrevDisabled:Boolean = true;
  btnMonthNextDisabled:Boolean = false;

  state:any;
  stateChangeSub:Subscription;

  step:Step;
  vars_for_view:any;
  datePickerCurrent:any;
  hebdoDays:any;
  dataCalendarYear:any;
  dataToReturnDays:any;
  dataToReturnDay:any;
  datePickerAll:any; // array of month

  brand_company:string;
  
  errorAdviseMessage:Subscription;
  errorMessage:string = null;

  constructor( 
    private dataStorageService:DataStorageService,
    private meta:Meta,
    private viewportScroller:ViewportScroller,
    ) { }

  ngOnInit() {
    this.state = this.dataStorageService.getState();
    this.stateChangeSub = this.dataStorageService.change_state.subscribe(
      (state) => { 
        this.step = this.state.active_step_model;
        this.vars_for_view = this.state.vars_for_view;
        this.datePickerCurrent = this.state.vars_for_view.datePicker_data[0];
        this.datePickerAll = this.state.vars_for_view.datePicker_data;
        this.hebdoDays = this.datePickerCurrent.dataToReturnMonth.hebdoDays;
        this.dataToReturnDays = this.dataReadyForNgFor(this.datePickerCurrent.dataToReturnDays);
      });
    this.step = this.state.active_step_model;
    this.vars_for_view = this.state.vars_for_view;
    this.brand_company = this.dataStorageService.myBrand.company;
    this.datePickerCurrent = this.state.vars_for_view.datePicker_data[0];
    this.datePickerAll = this.state.vars_for_view.datePicker_data;
    this.hebdoDays = this.datePickerCurrent.dataToReturnMonth.hebdoDays;
    this.dataToReturnDays = this.dataReadyForNgFor(this.datePickerCurrent.dataToReturnDays);
    
    this.dataStorageService.displayNavButtonDiv(false);
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


  onSelectDay(day){
    this.dataStorageService.getSelectedDay(day);
    this.viewportScroller.scrollToAnchor('next');
  }

  dataReadyForNgFor(arrayOfObject){
    let rawData = arrayOfObject;
    let dataValues = [];
    let dataKeys = [];
    for (let key in rawData){
      dataValues.push(rawData[key]);
      dataKeys.push(key);
    }
    return dataValues;
  }

  getNextMonth(curentMonth){
    let i;
    // console.log( 'this.datePickerAll.length:', this.datePickerAll.length);
    this.dataStorageService.disableNextBtn(true);
    for (i = 0; i< this.datePickerAll.length; i++){
      if ( curentMonth.dataCalendarMonthLabel === this.datePickerAll[i].dataCalendarMonthLabel ){
        this.datePickerCurrent = this.datePickerAll[i+1];
        // console.log('this.datePickerCurrent new:', this.datePickerCurrent);
        this.btnMonthPrevDisabled = false;
        if (i+1 === this.datePickerAll.length-1){
          this.btnMonthNextDisabled = true;
        }
        this.hebdoDays = this.datePickerCurrent.dataToReturnMonth.hebdoDays;
        this.dataToReturnDays = this.dataReadyForNgFor(this.datePickerCurrent.dataToReturnDays);
        this.dataStorageService.dispatchChangeMonth(true);
      }
    }
  }

  getPreviousMonth(curentMonth){
    // console.log('je clique previous');
    this.dataStorageService.disableNextBtn(true);
    let i;
    for (i =0; i<this.datePickerAll.length; i++){
      if ( curentMonth.dataCalendarMonthLabel === this.datePickerAll[i].dataCalendarMonthLabel ){
        this.datePickerCurrent = this.datePickerAll[i-1];
        this.btnMonthNextDisabled = false;
        if (i-1 === 0){
          this.btnMonthPrevDisabled = true;
        }
        this.hebdoDays = this.datePickerCurrent.dataToReturnMonth.hebdoDays;
        this.dataToReturnDays = this.dataReadyForNgFor(this.datePickerCurrent.dataToReturnDays);
        this.dataStorageService.dispatchChangeMonth(true);
      }
    }
  }

  ngOnDestroy():void {
    this.stateChangeSub.unsubscribe();
    this.errorAdviseMessage.unsubscribe();
  }

}
