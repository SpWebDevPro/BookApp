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

  isLoading:Boolean;

  errorAdviseMessage:Subscription;
  successAdviseMessage:Subscription;

  receivedData:Subscription;
  bookings:any = null;
  sortedBookings:any;
  today:any;

  constructor(
    private dataStorageService:DataStorageService,
    private helperCalendarService:HelperCalendarService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.dataStorageService.getUserAccountDetails();
    this.dataStorageService.displayHeaderAndFooter(false);
    this.dataStorageService.displayNavButtonDiv(true);
    this.today= this.getToday();
    //console.log(this.today);
    this.errorAdviseMessage = this.dataStorageService.advise_errorMessage_ds.subscribe(
      (error) => {
        this.dataStorageService.openDialog(error, null);
      });
    this.successAdviseMessage = this.dataStorageService.advise_successMessage_ds.subscribe(
      (success) => {
        this.dataStorageService.openDialog(null, success['message']);
      });
    this.receivedData = this.dataStorageService.advise_recieved_response_from_server.subscribe(
      (receiveddata:any) => {
        this.isLoading = false;
        this.bookings = receiveddata;
        //console.log('this.bookings :', this.bookings);
        let shortedBookings = this.shortBookings(this.bookings);
        this.sortedBookings = this.sortBookings(shortedBookings);
        //console.log('this.sortedBookings:', this.sortedBookings);

      }
    )
  }

  cancelBooking(id){
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
    let hour:string;
    hour = this.helperCalendarService.convertMinToHours(booking.start_time);
    let niceDate:string;
    niceDate = booking.start_date.concat(' ', hour, ':00');
    let finalDate;
    return finalDate = new Date(niceDate);
  }

  sortBookings(shortbookings){
    return shortbookings.sort(function(a,b){
      return (b.date) - (a.date);
    })
  }

  GoToFirstStep(){
    this.dataStorageService.getFirstStepFromWP();
  }

  getToday(){
    return new Date();
  }

  shouldDisplayCancellButton(date, status){
    if (date >= this.today && status !== 'annulé'){
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
