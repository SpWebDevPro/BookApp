import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { Step } from './step.model';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { PwaService } from './pwa.service';
import { fadeAnimation } from './route-animation';
import { AlertComponent } from './alert/alert.component';
import { NbDialogService } from '@nebular/theme';


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
  userAgent:any;
  isIos:any;
  isStandaloneMode:any;
  deviceInfo:any;
  browser:any;

  test:Boolean = true;

  message1:string;
  message2:string;
  message3:string;
  message4:string;
  
  


  constructor(
    private dataStorageService:DataStorageService,
    private router:Router,
    private authenticationService:AuthenticationService,
    private pwaService:PwaService,
    private dialogService:NbDialogService,
    ){
    }

  ngOnInit(){
    //handle app banner
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt event has been fired', event);
      this.deferredPrompt = event;
      console.log('deferredPrompt in ngoninit app :', this.deferredPrompt);
      // return false;
      this.pwaService.dispatchPromptInstallEvent(event);
    })
    this.userAgent = window.navigator.userAgent.toLowerCase();
    console.log('userAgent:', this.userAgent);
    this.browser = this.pwaService.checkBrowser();
    this.isIos = /iphone|ipad|ipod/.test(this.userAgent);
    console.log('isIos:', this.isIos);
    this.isStandaloneMode = window.matchMedia('(display-mode:standalone)').matches;
    console.log('this.isStandaloneMode:', this.isStandaloneMode);
    if(this.isIos && !this.isStandaloneMode){
      //here we should triger a pop up window explaining how to install app
      this.message1 = 'Vous pouvez ajouter l\'application à votre écran d\'accueil :';
      // this.message2 = 'Fermez ce message';
      this.message3 = 'Appuyez sur l\'icône';
      this.message4 = 'Sélectionnez : Sur l\'ecran d\'accueil';
      this.openDialog(this.message1, null, this.message3, this.message4);
    };
    if (this.browser == 'Samsung Internet' && !this.isStandaloneMode) {
      this.message1 = 'Vous pouvez ajouter l\'application à votre écran d\'accueil :';
      this.message2 = 'Dans la barre d\'url, cliquez sur l\'icône';
      this.message4 = 'Autorisez votre télephone à télécharger depuis cette source';
      this.openDialog(this.message1, this.message2, null, this.message4);
    }
    // if(this.test){
    //   this.message1 = 'Vous pouvez ajouter l\'application à votre écran d\'accueil :';
    //   this.message2 = 'Dans la barre d\'url, cliquez sur l\'icône';
    //   this.message4 = 'Puis, autorisez votre télephone à télécharger depuis cette source';
    //   this.openDialog(this.message1, this.message2, null, this.message4);
    // };

    //app running
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
        this.active_step_model = this.dataStorageService.getState().active_step_model;
        console.log('this.active_step_model.name:', this.active_step_model);
        if (this.active_step_model.name === 'verify'){
            console.log('i am blured');
            document.getElementById('next').blur();
        }
        this.btnNextIsDisabled = value;
       
      });
    this.btnPrevIsDisabledSub = this.dataStorageService.change_PrevButtonDisabled
      .subscribe((value:Boolean) => {
        // document.getElementById('prev').blur();
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

  onLogoClick(){
      this.router.navigate(['/welcome']);
      this.dataStorageService.displayHeaderAndFooter(true);
  }

  openDialog(message1:string, message2:string, message3:string, message4:string){
    let dialogref;
    return dialogref = this.dialogService.open(AlertComponent, {
      context: {
        alertMessage1:message1,
        alertMessage2:message2,
        alertMessage3:message3,
        alertMessage4:message4
      },
      autoFocus:false
    });
  }

  
}
