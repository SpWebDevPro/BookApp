import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { Step } from './_Models/step.model';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './authentication/authentication.service';
import { PwaService } from './pwa.service';
import { fadeAnimation } from './route-animation';
import { AlertComponent } from './alert/alert.component';
import { NbDialogService } from '@nebular/theme';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { NavigationService } from './navigation.service';
import { dbService } from './indexeddb.service';


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

  responseReceivedSub: Subscription;
  responseReceived:any;
  navEvent: NavigationStart;

  isLoggedIn:Boolean;
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
  headerDisabled:Boolean;

  deferredPrompt:any;
  btnAddApp:any;
  userAgent:any;
  isIos:any;
  isStandaloneMode:any;
  deviceInfo:any;
  browser:any;
  isMobileDevice:Boolean;
  installBannerForIos:Boolean;
  installBannerForSamsungInternet:Boolean;

  test:Boolean;

  newVersionAvailableSub:Subscription;
  newVersionAvailable:Boolean;

  message1:string;
  message2:string;
  message3:string;
  message4:string;

  
  
  constructor(
    private dataStorageService:DataStorageService,
    private router:Router,
    private navigationService:NavigationService,
    private dbService: dbService,
    private authenticationService:AuthenticationService,
    private pwaService:PwaService,
    private swUpdate:SwUpdate,
    private dialogService:NbDialogService,
    ){
      router.events
      .pipe(
        filter( event => {
          return (event instanceof NavigationStart);
        }
      ))
      .subscribe(
        (event:NavigationStart) => {
          this.navigationService.displayNavigationInfo(event);
          if (event.navigationTrigger === 'imperative'){
            //imperative means the user has interacted with application itself
            //in this case we save the event info.
            this.navEvent = event;
            this.state = this.dataStorageService.getState();
            let navObj = this.navigationService.createNavigationObject(this.navEvent.id, this.navEvent.url, this.state);
            this.navigationService.SaveNavigationInfo(navObj);
          }
          if ( event.navigationTrigger === 'popstate'){
            //popstate means the user has interacted with browser buttons
            // in this case, we check if the restoring navigation id has a match in indexed db
            // console.log('event.restoredState.navigationId:', event.restoredState.navigationId);
            //if so, 
            //lets use the datas in indexed db to display the page
            this.dbService.findMatchIdInDB(event.restoredState.navigationId)
            .then ( result => {
              console.log( 'resolve in app cpt:', result);
              if (result && (result.route === '/' || result.route === '/welcome' || result.route ==='/user')){
                console.log(result);
                this.dataStorageService.setStateFromIdb(result.state);
                router.navigate([result.route]);
              }
              else {
                router.navigate(['/welcome']);
              }
            })
          }
        }
      )
    }

  ngOnInit(){

  //**** clear the store for navigation process
  //*******************************************

    this.dbService.clearStore();


  //***** handle app banner
  //***********************

    window.addEventListener('beforeinstallprompt', (event) => {
      this.deferredPrompt = event;
      this.pwaService.dispatchPromptInstallEvent(event);
    })

    // tout ça devrait être regroupé dans le PWA service
    // detect browser/device/mode info
    this.userAgent = window.navigator.userAgent.toLowerCase();
    this.browser = this.pwaService.checkBrowser();
    this.isIos = /iphone|ipad|ipod/.test(this.userAgent);
    this.isMobileDevice = /Mobi|mobi/.test(this.userAgent) || /Android/.test(this.userAgent);
    this.isStandaloneMode = window.matchMedia('(display-mode:standalone)').matches;
    console.group("Browser and Device infos");
    console.log('isIos:', this.isIos);
    console.log('this.browser:', this.browser);
    console.log('this.userAgent:', this.userAgent);
    console.log('isMobileDevice:', this.isMobileDevice);
    console.log('this.isStandaloneMode:', this.isStandaloneMode);
    console.groupEnd();

    if(this.isIos && !this.isStandaloneMode && this.isMobileDevice){
      //here we should triger a pop up window explaining how to install app
      this.installBannerForIos = true;
      this.message1 = 'Vous pouvez ajouter l\'application à votre écran d\'accueil';
      // this.message2 = 'Fermez ce message';
      this.message3 = 'Appuyez sur l\'icône';
      this.message4 = 'Sélectionnez : Sur l\'ecran d\'accueil';
      // this.openDialog(this.message1, null, this.message3, this.message4);
    };
    if (this.browser == 'Samsung Internet' && !this.isStandaloneMode && this.isMobileDevice ) {
      this.installBannerForSamsungInternet = true;
      this.message1 = 'Vous pouvez ajouter l\'application à votre écran d\'accueil';
      this.message2 = 'Dans la barre d\'url, cliquez sur l\'icône';
      this.message4 = 'Autorisez votre télephone à télécharger depuis cette source';
      // this.openDialog(this.message1, this.message2, null, this.message4);
    }
    // if(this.test){
    //   this.installBannerForIos = true;
    //   this.message1 = 'Vous pouvez ajouter l\'application à votre écran d\'accueil';
    //   // this.message2 = 'Fermez ce message';
    //   this.message3 = 'Appuyez sur l\'icône';
    //   this.message4 = 'Sélectionnez : Sur l\'ecran d\'accueil';
    //   this.installBannerForSamsungInternet = true;
    //   this.message1 = 'Vous pouvez ajouter l\'application à votre écran d\'accueil :';
    //   this.message2 = 'Dans la barre d\'url, cliquez sur l\'icône';
    //   this.message4 = 'Autorisez votre télephone à télécharger depuis cette source';
    // };



  //**** handle update of the app
  //******************************

    this.swUpdate.available.subscribe( event => {
      console.log(event);
      this.pwaService.PromtNewVersion(true);
    })

    this.newVersionAvailableSub = this.pwaService.advise_new_version_available.subscribe((IsnewVersion) => {
      this.newVersionAvailable = IsnewVersion;
      console.log('a new version of the app is available');
      // if newVersionAvailable === true, a div is prompting the user to update
      if (this.newVersionAvailable === true ){
        this.headerAndFooterDisabled = false;
        this.navButtonsDisabled = true;
      }
    })

    
  //**** app running
  //****************

    //get steps from backend
    this.dataStorageService.getStepsModelsFromWP();


    //prepare UI
    this.headerAndFooterDisabledSub = this.dataStorageService.change_headerAndFooterDisabled
      .subscribe( (hfNewDisplay) => {
        this.headerAndFooterDisabled = hfNewDisplay;
        // console.log('this.headerAndFooterDisabled is now: ', this.headerAndFooterDisabled);
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
        this.btnPrevIsDisabled = value;
      });
    this.btnMenu = "Continuer";
    this.btnMenuAdviseChange = this.dataStorageService.change_btnMenu
      .subscribe((value:string) => {
        this.btnMenu = value;
      });

    //check Authentication
    this.IsLoggedInSub = this.authenticationService.login_status
    .subscribe((value:Boolean) => {
      this.isLoggedIn = value;
      console.log('From app cpt, this.isLoggedIn :', this.isLoggedIn);
    });
    // this.authenticationService.isLoggedIn();
    

    //go to splash screen welcome
    this.toWelcome(this.router);
  }

  

  // true will display only bottom menu for alert
  displayOnlyFooterMenuForAlert(value:Boolean){
    if (value === true) {
      this.headerAndFooterDisabled = false;
      this.headerDisabled = true;
    }
    else {
      this.headerAndFooterDisabled = true;
      this.headerDisabled = false;
    }
  }

  toWelcome(router){
    setTimeout(()=> {
      router.navigate(['/welcome']);
      if (this.newVersionAvailable || this.installBannerForSamsungInternet || this.installBannerForIos) {
        this.displayOnlyFooterMenuForAlert(true);
      } else {
        this.dataStorageService.displayHeaderAndFooter(true);
      }
    },4000);
  }

  goStep(direction){
    this.btnDirection = direction.hostElement.nativeElement.id;
    this.dataStorageService.goToNextStep(this.btnDirection);
  }

  onLogOut(){
    this.authenticationService.logOutUser();
    this.dbService.clearStore();
  }

  onLogoClick(){
      this.router.navigate(['/welcome']);
      this.dataStorageService.displayHeaderAndFooter(true);
  }

  updateVersion(){
    window.location.reload();
    this.newVersionAvailable = false;
    this.displayOnlyFooterMenuForAlert(false);
    this.onLogOut();
  }

  closeDivNewVersion(){
    this.newVersionAvailable = false;
    if (!this.newVersionAvailable && !this.installBannerForIos && !this.installBannerForSamsungInternet){
      this.displayOnlyFooterMenuForAlert(false);
    }
  }

  closeInstallBanner(){
    this.installBannerForIos = false;
    this.installBannerForSamsungInternet = false;
    if (!this.newVersionAvailable && !this.installBannerForIos && !this.installBannerForSamsungInternet){
      this.displayOnlyFooterMenuForAlert(false);
    }
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

  ngOnDestroy():void {
    this.headerAndFooterDisabledSub.unsubscribe();
    this.navButtonsDisabledSub.unsubscribe();
    this.btnNextIsDisabledSub.unsubscribe();
    this.btnPrevIsDisabledSub.unsubscribe();
    this.IsLoggedInSub.unsubscribe();
    this.btnMenuAdviseChange.unsubscribe();
    this.newVersionAvailableSub.unsubscribe();
  }
  
}
