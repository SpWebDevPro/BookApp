import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../data-storage.service';
import { NbDialogService } from '@nebular/theme';
import { HandlingErrorsComponent } from '../handling-errors/handling-errors.component';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  showPassword = false;

  formDisplay:string = ''; //login or register or askForNewPassword or changePassword
  displayLogin:Boolean;
  displayRegister:Boolean;
  displayAskForNewPassword:Boolean;
  displayChangePassword:Boolean;
  pageTitle:string = "";
  pageMenus:any; // array with 'Me connecter', 'Créer un compte', 'Mot de passe oublié ?'

  isLoadingStatus:Subscription;
  isLoading:Boolean = false;

  isLoggedIn:Boolean = false;

  errorAdviseMessage:Subscription;
  errorMessage:string = null;

  successAdviseMessage:Subscription;
  successMessage:string = null;

  errorAdviseMessage_ds:Subscription;
  errorMessage_ds:string = null;

  base_url:string;
  url_retreive_password:string;

  registerForm = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(98)]),
    'password': new FormControl(null, Validators.compose([
      Validators.required,
      Validators.maxLength(253),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    ]))
  });

  loginForm = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(98)]),
    'password': new FormControl(null, [Validators.required, Validators.maxLength(253)] )
  });

  askForNewPasswordForm = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(98)])
  })

  changePasswordForm = new FormGroup({
    'tokenPassword': new FormControl(null, [Validators.required, Validators.maxLength(253)] ),
    'password': new FormControl(null, Validators.compose([
      Validators.required,
      Validators.maxLength(253),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    ])),
    'confirmedPassword': new FormControl(null, Validators.compose([
      Validators.required,
      Validators.maxLength(253),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    ]))
  //rajouter le validator entre password et confirmedPassword
  })

  constructor(
    private authenticationService:AuthenticationService,
    private dataStorageService:DataStorageService,
    private dialogService:NbDialogService
  ) { }

  ngOnInit() {
    
    this.changeDisplay('login');

    this.errorAdviseMessage = this.authenticationService.advise_errorMessage.subscribe(
      (error) => {
        //console.log('im in auth component and receive error message');
        this.errorMessage = error;
        this.openDialog(error, null);
        
      });
    this.errorAdviseMessage_ds = this.dataStorageService.advise_errorMessage_ds.subscribe(
        (error) => {
          this.dataStorageService.openDialog(error, null);
          this.errorMessage_ds = error;
        });
    this.successAdviseMessage = this.authenticationService.advise_successMessage.subscribe(
      (success) => {
        this.successMessage = success;
        if(this.successMessage === 'Nous vous avons envoyé un mail pour modifier votre mot de passe. La réception peut prendre quelques minutes'){
          this.changeDisplay('changePassword');
        }
        if(this.displayLogin){
              this.changeDisplay('login');
        }
        if(this.successMessage === 'Votre mot de passe a été mis à jour !'){
          this.changeDisplay('login');
        }
        this.openDialog(null, success);
      });
    this.isLoadingStatus = this.dataStorageService.change_is_Loading_data.subscribe(
      status => this.isLoading = status);
  }

  getInputType(){
    if (this.showPassword){
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword(){
    this.showPassword = !this.showPassword;
    this.getInputType();
    // console.log('this.showPassword is now:', this.showPassword);
  }

  handleMenuChoice(menuChoice){
    if(menuChoice === 'Me connecter'){
      this.changeDisplay('login');
    }
    if(menuChoice === 'Créer un compte'){
      this.changeDisplay('register');
    }
    if(menuChoice === 'Mot de passe oublié ?'){
      this.changeDisplay('askForNewPassword');
    }
  }

  changeDisplay(formToDisplay){
    if (formToDisplay === 'login'){
      this.formDisplay = 'login';
      this.pageTitle = "Me connecter";
      this.pageMenus = ["Créer un compte", "Mot de passe oublié ?" ]; 
      this.displayLogin = true;
      this.displayRegister = false;
      this.displayAskForNewPassword = false;
      this.displayChangePassword = false;
    }
    if (formToDisplay === 'register'){
      this.formDisplay = 'register';
      this.pageTitle = "Créer un compte";
      this.pageMenus = ["Me connecter" ];
      this.displayLogin = false;
      this.displayRegister = true;
      this.displayAskForNewPassword = false;
      this.displayChangePassword = false;
    }
    if (formToDisplay === 'askForNewPassword'){
      this.formDisplay = 'askForNewPassword';
      this.pageTitle = "Demander un nouveau mot de passe";
      this.pageMenus = ["Me connecter", "Créer un compte" ];
      this.displayLogin = false;
      this.displayRegister = false;
      this.displayAskForNewPassword = true;
      this.displayChangePassword = false;
    }
    if (formToDisplay === 'changePassword'){
      this.formDisplay = 'changePassword';
      this.pageTitle = "Définir mon nouveau mot de passe";
      this.pageMenus = ["Me connecter", "Créer un compte" ];
      this.displayLogin = false;
      this.displayRegister = false;
      this.displayAskForNewPassword = false;
      this.displayChangePassword = true;
    }
  }

  trimForm(formValue){
    if (formValue.email){
      formValue.email = formValue.email.trim();
    }
    if (formValue.password){
      formValue.password = formValue.password.trim();
    }
    if (formValue.tokenPassword){
      formValue.tokenPassword = formValue.tokenPassword.trim();
    }
    if (formValue.confirmedPassword){
      formValue.confirmedPassword = formValue.confirmedPassword.trim();
    }
    return formValue;
  }


  onSubmit(){
    if(this.formDisplay === 'login'){
      let form = this.trimForm(this.loginForm.value);
      this.authenticationService.logInUser(form);
      this.loginForm.reset();
      this.dataStorageService.dispatchIsLoadingStatus(true);
    }
    if(this.formDisplay === 'register'){
      let form = this.trimForm(this.registerForm.value);
      this.authenticationService.registerUser(form);
      this.registerForm.reset();
      this.dataStorageService.dispatchIsLoadingStatus(true);
      if (!this.errorMessage) {this.changeDisplay('login')};
    }
    if(this.formDisplay === 'askForNewPassword'){
      let form = this.trimForm(this.askForNewPasswordForm.value);
      this.authenticationService.askForNewPassword(form);
      if (this.successMessage) {
        this.askForNewPasswordForm.reset();
        // this.changeDisplay('changePassword');
      }
    }
    if(this.formDisplay === 'changePassword'){
      let form = this.trimForm(this.changePasswordForm.value);
      this.authenticationService.confirmChangePassword(form);

      //ici on appellera une fonction qui enverra une requete au back
      //pour enregistrer le nouveau mot de passe.
      //si pas d'erreur message, on renverra sur login;
      if (!this.errorMessage) {
        this.changePasswordForm.reset();
        // this.changeDisplay('login');
      }
    }

  }

  openDialog(errMess,successMess){
    let dialogref;
    return dialogref = this.dialogService.open(HandlingErrorsComponent, {
      context: {
        errorMessageAuth:errMess,
        successMessageAuth:successMess
      },
      autoFocus:false
    });
  }

  ngOnDestroy(){
    this.errorAdviseMessage.unsubscribe();
    this.errorAdviseMessage_ds.unsubscribe();
    this.successAdviseMessage.unsubscribe();
    this.isLoadingStatus.unsubscribe();
  }


}
