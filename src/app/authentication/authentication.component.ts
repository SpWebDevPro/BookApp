import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
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

  pageDisplayIsLogin:Boolean;
  pageTitle:string = "";
  pageMenu:string = "";

  isLoadingStatus:Subscription;
  isLoading:Boolean = false;

  isLoggedIn:Boolean = false;

  errorAdviseMessage:Subscription;
  errorMessage:string = null;

  successAdviseMessage:Subscription;
  // successMessage:string = null;

  base_url:string;
  url_retreive_password:string;

  registerForm = new FormGroup({
    'username': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(58)]),
    'email': new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(98)]),
    'password': new FormControl(null, [Validators.required, Validators.maxLength(253)] )
  });

  loginForm = new FormGroup({
    'username': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(58)]),
    'password': new FormControl(null, [Validators.required, Validators.maxLength(253)] )
  });

  constructor(
    private authenticationService:AuthenticationService,
    private dataStorageService:DataStorageService,
    private dialogService:NbDialogService
  ) { }

  ngOnInit() {
    this.pageDisplayIsLogin = true;
    this.pageTitle = "Me connecter";
    this.pageMenu = "Créer un compte";
    this.errorAdviseMessage = this.authenticationService.advise_errorMessage.subscribe(
      (error) => {
        this.openDialog(error, null);
        this.errorMessage = error;
      });
    this.successAdviseMessage = this.authenticationService.advise_successMessage.subscribe(
      (success) => {
        this.openDialog(null, success);
        if(!this.pageDisplayIsLogin){
          this.changeDisplay();
        }
      });
    this.isLoadingStatus = this.dataStorageService.change_is_Loading_data.subscribe(
      status => this.isLoading = status);
    this.base_url = this.dataStorageService.myBrand.baseUrlApi;
    this.url_retreive_password = `${this.base_url}/wp-login.php?action=lostpassword`;
  }

  ngOnDestroy(){
    this.errorAdviseMessage.unsubscribe();
    this.successAdviseMessage.unsubscribe();
    this.isLoadingStatus.unsubscribe();
  }

  changeDisplay(){
    if(this.pageDisplayIsLogin) {
      this.pageDisplayIsLogin = ! this.pageDisplayIsLogin;
      this.pageTitle = "Créer un compte";
      this.pageMenu = "Me connecter";
    }
    else {
      this.pageDisplayIsLogin = ! this.pageDisplayIsLogin;
      this.pageTitle = "Me connecter";
      this.pageMenu = "Créer un compte";
    }
  }

  onSubmit(){
    if (this.pageDisplayIsLogin) {
      this.authenticationService.logInUser(this.loginForm.value);
      this.loginForm.reset();
      this.dataStorageService.dispatchIsLoadingStatus(true);
    } else {
      this.authenticationService.registerUser(this.registerForm.value);
      this.registerForm.reset();
      this.dataStorageService.dispatchIsLoadingStatus(true);
      if (!this.errorMessage) {this.changeDisplay()};
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

}
