import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SlotPickerComponent } from './slot-picker/slot-picker.component';
import { ContactComponent } from './contact/contact.component';
import { ServiceOfferComponent } from './service-offer/service-offer.component';
import { AgentOfferComponent } from './agent-offer/agent-offer.component';
import { InitComponent } from './init/init.component';
import { VerifyComponent } from './verify/verify.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LodingSpinnerComponent } from './loding-spinner/loding-spinner.component';
import { HandlingErrorsComponent } from './handling-errors/handling-errors.component';
import { AuthGuard } from './authentication/auth-guard.service';
import { Error404Component } from './error404/error404.component';
import { AlertComponent } from './alert/alert.component';

const routerOptions:ExtraOptions = {
  anchorScrolling:'enabled',
  scrollOffset: [0, 75],
  // useHash:true,
}

const routes: Routes = [
  { path:'', component:InitComponent, data:{ state:'init'}},
  { path:'welcome', component:WelcomeComponent, data: {state:'welcome'}},
  { path:'services', component:ServiceOfferComponent, canActivate:[AuthGuard], data: {state:'services'}},
  { path:'agents', component:AgentOfferComponent, canActivate:[AuthGuard], data: {state:'agents'}},
  { path:'datepicker', component:SlotPickerComponent, canActivate:[AuthGuard], data: {state:'datepicker'}},
  { path:'contact', component:ContactComponent, canActivate:[AuthGuard], data: {state:'contact'}},
  // { path:'payment', component:},
  { path:'verify', component:VerifyComponent, canActivate:[AuthGuard], data: {state:'verify'}},
  { path:'confirmation', component:ConfirmationComponent, canActivate:[AuthGuard], data: {state:'confirmation'}},
  { path:'user', component:AuthenticationComponent, data: {state:'user'}},
  { path:'uimessage', component:HandlingErrorsComponent, data: {state:'uimessage'}},
  { path:'loding-spinner', component:LodingSpinnerComponent, data: {state:'loding-spinner'}},
  { path:'alert', component:AlertComponent, data: {state:'alert'}},
  { path: '**', component:Error404Component}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
