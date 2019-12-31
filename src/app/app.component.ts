import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { Step } from './step.model';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { PwaService } from './pwa.service';
import { fadeAnimation } from './route-animation';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations:  [ fadeAnimation ]
})
export class AppComponent implements OnInit, OnDestroy {

  steps_models:Step[];
  active_step_model:Step;
  state:any;

  isLoggedIn:Boolean = false;
  IsLoggedInSub:Subscription;

  notOn:Boolean = false;

  navButtonsDisabled:Boolean = true;
  navButtonsDisabledSub:Subscription;

  btnNextIsDisabled:Boolean = false;
  btnNextIsDisabledSub:Subscription;

  btnPrevIsDisabled:Boolean = false;
  btnPrevIsDisabledSub:Subscription;

  btnDirection:string;
  btnMenu:string;
  btnMenuAdviseChange:Subscription;

  headerAndFooterDisabled:Boolean = true;
  headerAndFooterDisabledSub: Subscription;

  deferredPrompt:any;
  btnAddApp:any;
  


  constructor(
    private dataStorageService:DataStorageService,
    private router:Router,
    private authenticationService:AuthenticationService,
    private pwaService:PwaService,
    ){
    }

  ngOnInit(){
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt event has been fired', event);
      this.deferredPrompt = event;
      console.log('deferredPrompt in ngoninit app :', this.deferredPrompt);
      // return false;
      this.pwaService.dispatchPromptInstallEvent(event);
    })
    this.dataStorageService.getStepsModelsFromWP();
    this.headerAndFooterDisabledSub = this.dataStorageService.change_headerAndFooterDisabled
      .subscribe( (hfNewDisplay) => {
        this.headerAndFooterDisabled = hfNewDisplay;
      });
    this.navButtonsDisabledSub = this.dataStorageService.change_navButtonDisabled
      .subscribe((navbutNewDisplay) => {
        this.navButtonsDisabled = navbutNewDisplay;
      });
    this.btnNextIsDisabledSub = this.dataStorageService.change_NextButtonDisabled
      .subscribe((value:Boolean) => {
        this.btnNextIsDisabled = value;
      });
    this.btnPrevIsDisabledSub = this.dataStorageService.change_PrevButtonDisabled
      .subscribe((value:Boolean) => {
        this.btnPrevIsDisabled = value;
      });
    this.IsLoggedInSub = this.authenticationService.login_status
      .subscribe((value:Boolean) => {
        this.isLoggedIn = value;
      });
    this.btnMenu = "Continuer";
    this.btnMenuAdviseChange = this.dataStorageService.change_btnMenu
      .subscribe((value:string) => {
        this.btnMenu = value;
      });
    //for now, if the user is still connected when relaunched the app, we disconect and invite to relog
    if (this.authenticationService.isLoggedIn()){
      this.authenticationService.logOutUser()
    };
      // check isJWTValid() if yes, retreive user info, and skip login process
    this.toWelcome(this.router);
    // this.dataStorageService.getTest();
  }

  ngOnDestroy():void {
    this.headerAndFooterDisabledSub.unsubscribe();
    this.navButtonsDisabledSub.unsubscribe();
    this.btnNextIsDisabledSub.unsubscribe();
    this.btnPrevIsDisabledSub.unsubscribe();
    this.IsLoggedInSub.unsubscribe();
    this.btnMenuAdviseChange.unsubscribe();
  }

  toWelcome(router){
    setTimeout(()=> {
      router.navigate(['/welcome']);
      this.dataStorageService.displayHeaderAndFooter(true);
    },4000);
  }

  goStep(direction){
    this.btnDirection = direction.hostElement.nativeElement.id;
    this.dataStorageService.goToNextStep(this.btnDirection);
  }

  onLogOut(){
    this.authenticationService.logOutUser();
  }

  
}
