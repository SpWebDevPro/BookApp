import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../_Models/step.model';
import { AuthenticationService } from '../authentication/authentication.service';
import { PwaService } from '../pwa.service';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  IsLoggedInSub:Subscription;
  isLoggedIn:Boolean;
  
  brand_Name_Application:string;
  brand_welcome_message:string;
  brand_company:string;
  brand_url:string;
  step_name:string;
  active_step_model:Step;

  displayAppBtn:Boolean = true;
  displayShareBtn:Boolean;
  // for testing
  // displayShareBtn:Boolean = true;

  deferredPrompt:any;
  catched_prompt_installation_sub:Subscription;

  navigator_var:any;

  constructor(
    private dataStorageService:DataStorageService,
    private authenticationService:AuthenticationService,
    private router:Router,
    private pwaService:PwaService,
    private meta:Meta
   ){}

  ngOnInit() {

    this.dataStorageService.displayHeaderAndFooter(true);

    this.catched_prompt_installation_sub = this.pwaService.catched_prompt_installation.subscribe((event)=>{
      this.deferredPrompt = event;
    });

    this.IsLoggedInSub = this.authenticationService.login_status
    .subscribe((value:Boolean) => {
      this.isLoggedIn = value;
      console.log('From welcome cpt, this.isLoggedIn :', this.isLoggedIn);
      // if(!this.isLoggedIn){
      //   this.authenticationService.logOutUser();
      // }
    });
    this.authenticationService.isLoggedIn();
    if(!this.isLoggedIn){
      this.authenticationService.logOutUser();
    }

    this.brand_Name_Application = this.dataStorageService.myBrand.name;
    this.brand_welcome_message = this.dataStorageService.myBrand.welcome;
    this.brand_company = this.dataStorageService.myBrand.company;
    this.brand_url = this.dataStorageService.myBrand.appUrl;
    this.meta.addTags([
      {
        name:'description',
        content:`${this.brand_Name_Application}, ${this.brand_welcome_message}`
      },
      {
        name:'author',
        content:`${this.brand_company}`
      },
    ])

    this.navigator_var = window.navigator;
    if ( this.navigator_var && this.navigator_var.share){
      console.log('fonctionnalité de partage supportée');
      this.displayShareBtn = true;
      // this.navigator_var.share({
      //   title: this.brand_Name_Application,
      //   text: this.brand_welcome_message,
      //   url:this.brand_url,
      // })
      // .then(()=> console.log('Merci d\'avoir partagé'))
      // .catch((error) => console.log('erreur de partage :', error))
    }
    else {
      console.log('fonctionnalité de partage non supportée');
    }
  
  }

  startProcess(){
    if (this.isLoggedIn){ 
      console.log('ok je suis loggedIN');
      this.authenticationService.getFirstStep();
      //est ce que j'ai bien mes infos mails?
    }
    else {
      this.authenticationService.goToAuthenticate('firststep');
    }
  }


  goToUserAccount(){
    if (this.isLoggedIn){ 
      console.log('ok je suis loggedIN');
      this.router.navigate(['/useraccount']);
    }
    else {
      this.authenticationService.goToAuthenticate('useraccount');
    }
  }


  promptInstall(){
    // console.log('je clic sur installer l appli');
    this.displayAppBtn = false;
    this.pwaService.promptInstallation(this.deferredPrompt);
  }

  shareApp(){
    console.log('je vais share l app');
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

  ngOnDestroy(){
    this.catched_prompt_installation_sub.unsubscribe();
    this.IsLoggedInSub.unsubscribe();
  }

}
