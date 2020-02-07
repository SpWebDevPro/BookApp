import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../_Models/step.model';
import { Customer } from '../_Models/customer.model';
import { AuthenticationService } from '../authentication/authentication.service';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  validatorPhoneMessage:String;

  state:any;
  stateChangeSub:Subscription;

  step:Step;
  vars_for_view:any;
  customer:Customer;
  user_email:string;

  brand_company:string;
  
  constructor(
    private dataStorageService:DataStorageService,
    private authenticationService:AuthenticationService,
    private meta:Meta
    ) { }

  ngOnInit() {

    this.dataStorageService.displayNavButtonDiv(false);
    this.dataStorageService.disableNextBtn(true);
    this.dataStorageService.disablePrevBtn(false);

    this.user_email = this.authenticationService.getUserEmaillocalStorage();
    this.state = this.dataStorageService.getState();
    this.step = this.state.active_step_model;
    this.vars_for_view = this.state.vars_for_view;
    this.customer = this.state.customer;

    this.stateChangeSub = this.dataStorageService.change_state.subscribe(
      (state) => { 
        this.state = state;
        this.step = this.state.active_step_model;
        this.vars_for_view = this.state.vars_for_view;
        this.customer = this.state.customer;
      });

    this.brand_company = this.dataStorageService.myBrand.company;
    this.meta.addTags([
      { name:'description',content:`${this.step.sub_title}`},
      { name:'author',content:`${this.brand_company}`}
    ])

    let prefilled_last_name:string; 
      if (this.state.customer.last_name){
        prefilled_last_name = this.state.customer.last_name;
      } else {
        prefilled_last_name = '';
      }
    let prefilled_first_name:string;
      if (this.state.customer.first_name){
        prefilled_first_name = this.state.customer.first_name;
      } else {
          prefilled_first_name = '';
        }
    let prefilled_phone:string;
      if (this.state.customer.phone){
        prefilled_phone = this.state.customer.phone;
      } else {
        prefilled_phone = '';
      }
    let prefilled_email:string;
      if (this.user_email){
        prefilled_email = this.user_email
      }
      else {
        prefilled_email = '';
      }
      
    this.contactForm = new FormGroup({
      'nom': new FormControl(
        prefilled_last_name, 
        [Validators.required, Validators.minLength(3)]),
      'prenom': new FormControl(
        prefilled_first_name, 
        [Validators.required, Validators.minLength(3)]),
      'tel': new FormControl(
        prefilled_phone, 
        Validators.compose([
          Validators.required, 
          Validators.pattern('^(?:(?:\\+|00)33[\\s.-]{0,3}(?:\\(0\\)[\\s.-]{0,3})?|0)[1-9](?:(?:[\\s.-]?\\d{2}){4}|\\d{2}(?:[\\s.-]?\\d{3}){2})$')
        ])),
      'email': new FormControl(
        { value:prefilled_email,
          disabled:true
        },
        [Validators.required, Validators.email]),
      'commentaire': new FormControl(null, Validators.maxLength(100))
    });
  }

  //patern phone number that are OK
  //To be tested
    // 0123456789
    // 01 23 45 67 89
    // 01.23.45.67.89
    // 0123 45.67.89
    // 0033 123-456-789
    // +33-1.23.45.67.89
    // +33 - 123 456 789
    // +33(0) 123 456 789
    // +33 (0)123 45 67 89
    // +33 (0)1 2345-6789
    // +33(0) - 123456789

  onSubmit(){
    this.customer.first_name = this.contactForm.value.prenom;
    this.customer.last_name = this.contactForm.value.nom;
    this.customer.phone = this.contactForm.value.tel;
    this.customer.email = this.user_email;
    this.customer.notes = this.contactForm.value.commentaire;
    let bookDataToPass = {
      customer:this.customer
    }
    this.dataStorageService.collectBookingInfo(bookDataToPass);
    this.dataStorageService.disableNextBtn(false);
  }

  ngOnDestroy():void {
    this.stateChangeSub.unsubscribe();
    // this.errorAdviseMessage.unsubscribe();
  }

}
