import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Step } from '../step.model';
import { AuthenticationService } from '../authentication.service';
import { PwaService } from '../pwa.service';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  brand_Name_Application:string;
  brand_welcome_message:string;
  brand_company:string
  step_name:string;
  active_step_model:Step;

  displayAppBtn:Boolean = true;
  
  deferredPrompt:any;
  catched_prompt_installation_sub:Subscription;

  constructor(
    private dataStorageService:DataStorageService,
    private authenticationService:AuthenticationService,
    private pwaService:PwaService,
    private meta:Meta
   ){}

  ngOnInit() {
    this.brand_Name_Application = this.dataStorageService.myBrand.name;
    this.brand_welcome_message = this.dataStorageService.myBrand.welcome;
    this.brand_company = this.dataStorageService.myBrand.company;
    this.catched_prompt_installation_sub = this.pwaService.catched_prompt_installation.subscribe((event)=>{
      this.deferredPrompt = event;
      // console.log('in welcome component, i catch this.deferedpromt:', this.deferredPrompt);
    });
    // console.log('deferredPrompt:', this.deferredPrompt);
    // console.log('displayAppBtn:', this.displayAppBtn);
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
  }

  ngOnDestroy(){
    this.catched_prompt_installation_sub.unsubscribe();
  }

  toAuthenticate(){
    if (this.authenticationService.isLoggedIn){ this.authenticationService.logOutUser() };
    this.authenticationService.goToAuthenticate();
  }

  promptInstall(){
    // console.log('je clic sur installer l appli');
    this.displayAppBtn = false;
    this.pwaService.promptInstallation(this.deferredPrompt);
  }

}
