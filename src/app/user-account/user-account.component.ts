import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Subscription } from 'rxjs';
import { HelperCalendarService } from '../helper-calendar.service';


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit, OnDestroy {

  errorAdviseMessage:Subscription;
  // errorMessage:string = null;

  successAdviseMessage:Subscription;
  // successMessage:string = null;

  receivedData:Subscription;
  bookings:any = null;
  sortedBookings:any;
  today:any;


  constructor(
    private dataStorageService:DataStorageService,
    private helperCalendarService:HelperCalendarService
  ) { }

  ngOnInit() {
    this.dataStorageService.displayNavButtonDiv(true);
    this.today= this.getToday();
    console.log(this.today);
    this.errorAdviseMessage = this.dataStorageService.advise_errorMessage_ds.subscribe(
      (error) => {
        this.dataStorageService.openDialog(error, null);
        // this.errorMessage = error;
      });
    this.successAdviseMessage = this.dataStorageService.advise_successMessage_ds.subscribe(
      (success) => {
        console.log('success:', success['message']);
        this.dataStorageService.openDialog(null, success['message']);
        // this.successMessage = success.message;
      });
    this.receivedData = this.dataStorageService.advise_recieved_response_from_server.subscribe(
      (receiveddata:any) => {
        // console.log('jai reçu les nouveaux bookings');
        this.bookings = receiveddata;
        // console.log('receiveddata:', receiveddata);
        let shortedBookings = this.shortBookings(this.bookings);
        // console.log('shortedBookings:', shortedBookings);
        this.sortedBookings = this.sortBookings(shortedBookings);
        // console.log('sortedBookings:', this.sortedBookings);
      }
    )
  }

  cancelBooking(id){
    console.log('je veux annuler le booking id: ', id);
    this.dataStorageService.cancelBooking(id);
    this.dataStorageService.getUserAccountDetails();
  }

  shortBookings(bookings){
   return bookings.map(
      ( booking) => {
        let niceDate;
        niceDate = this.getDateHourBooking(booking);
        let status;
        if (booking.status == 'cancelled'){
          status = 'annulé';
        }
        booking.nice_date = niceDate;
        return {
          date:new Date(booking.start_date),
          time:booking.start_time,
          nice_date:booking.nice_date,
          id:booking.id,
          status:status,
          booking_nice:booking.booking_nice,
        }}
        )
  }

  getDateHourBooking(booking){
    console.log(booking);
    let hour:string;
    hour = this.helperCalendarService.convertMinToHours(booking.start_time);
    let niceDate:string;
    niceDate = booking.start_date.concat(' ', hour, ':00');
    // console.log('niceDate: ', niceDate);
    let finalDate;
    return finalDate = new Date(niceDate);
  }

  sortBookings(shortbookings){
    return shortbookings.sort(function(a,b){
      return (b.date) - (a.date);
    })
  }

  getToday(){
    return new Date();
  }

  shouldDisplayCancellButton(date, status){
    if (date >= this.today && status !== 'annulé'){
      // console.log('true');
      return true
    }
    else {
      return false;
    }
  }

  ngOnDestroy():void {
    this.errorAdviseMessage.unsubscribe();
    this.successAdviseMessage.unsubscribe();
    this.receivedData.unsubscribe();
  }

}
