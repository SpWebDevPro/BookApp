import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppRoutingModule } from './app-routing.module';
import { AppNebularModule } from './app-nebular.module';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { AgentCardComponent } from './agent-card/agent-card.component';
import { SlotPickerComponent } from './slot-picker/slot-picker.component';
import { ContactComponent } from './contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataStorageService } from './data-storage.service';
import { ServiceOfferComponent } from './service-offer/service-offer.component';
import { AgentOfferComponent } from './agent-offer/agent-offer.component';
import { InitComponent } from './init/init.component';
import { DayInMonthComponent } from './day-in-month/day-in-month.component';
import { VerifyComponent } from './verify/verify.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthenticationService } from './authentication.service';
import { TokenInterceptor } from './authentication/token-interceptor.service'
import { HelperCalendarService } from './helper-calendar.service';
import { MinToHoursPipe } from './mintohours.pipe';
import { LodingSpinnerComponent } from './loding-spinner/loding-spinner.component';
import { HandlingErrorsComponent } from './handling-errors/handling-errors.component';
import { NbDialogModule } from '@nebular/theme';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PwaService } from './pwa.service';
import { AuthGuard } from './authentication/auth-guard.service';
import { Error404Component } from './error404/error404.component';
import { AlertComponent } from './alert/alert.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ServiceCardComponent,
    AgentCardComponent,
    SlotPickerComponent,
    ContactComponent,
    ServiceOfferComponent,
    AgentOfferComponent,
    InitComponent,
    DayInMonthComponent,
    VerifyComponent,
    ConfirmationComponent,
    AuthenticationComponent,
    MinToHoursPipe,
    LodingSpinnerComponent,
    HandlingErrorsComponent,
    Error404Component,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppNebularModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbDialogModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [ 
    {provide: LOCALE_ID, useValue:'fr'},
    DataStorageService,
    AuthenticationService,
    HelperCalendarService,
    PwaService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass:TokenInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
