import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../data-storage.service';
import { HelperCalendarService } from '../helper-calendar.service';

@Component({
  selector: 'app-day-in-month',
  templateUrl: './day-in-month.component.html',
  styleUrls: ['./day-in-month.component.scss']
})
export class DayInMonthComponent implements OnInit, OnDestroy {

  displayDayAvailability:Boolean = false;
  displayBookingSelection:Boolean = false;
  daySelected:Subscription;
  monthChanged:Subscription;

  dataDay:any;
  dataAvailableMinutes:any[];
  dataAvailableHours:any[];
  dataAvailableHour:any;

  // dataNiceDate=dataDay.dataNiceDate
  // dataServiceDuration=dataDay.dataServiceDuration
  // dataTotaWorkMinutes=dataDay.dataTotalWorkMinutes
  // dataWorkStartTime=dataDay.dataWorkStartTime
  // dataWorkEndTime=dataDay.dataWorkEndTime
  // dataAvailableMinutes=dataDay.dataAvailableMinutes
  // dataDayMinutes=dataDay.dataDayMinutes
  // DataInterval=dataDay.dataInterval

  constructor( 
    private dataStorageService:DataStorageService,
    private helperCalendarService:HelperCalendarService
    ) { }

  ngOnInit() {
    this.daySelected = this.dataStorageService.change_selected_day
    .subscribe((day) => {
      this.dataDay = day;
      this.displayDayAvailability = true;
      this.displayBookingSelection = false;
      this.dataAvailableMinutes = this.dataDay.dataAvailableMinutes.split(',');
      this.dataAvailableHours = this.dataAvailableMinutes.map((e)=>{
        return this.helperCalendarService.convertMinToHours(parseInt(e,10));
      })
      // console.log('this.dataAvailableMinutes', this.dataAvailableMinutes);
      // console.log('this.dataAvailableHours', this.dataAvailableHours);
    })
    this.monthChanged = this.dataStorageService.change_month
    .subscribe((value) => {
      this.displayDayAvailability = false;
      this.displayBookingSelection = false;
    })
  }

  ngOnDestroy(){
    this.daySelected.unsubscribe();
    this.displayDayAvailability = false;
    this.displayBookingSelection = false;
  }

  selectHour(day, AvailableHour){
    this.displayBookingSelection = false;
    // console.log('selected Hour', AvailableHour );
    this.dataAvailableHour = AvailableHour;
    this.displayBookingSelection = true;
    this.dataStorageService.disableNextBtn(false);
    let startTimeInMin = this.helperCalendarService.convertHourstoMin(AvailableHour);
    let bookDataToPass = {
      start_date:day,
      start_time:startTimeInMin
    };
    this.dataStorageService.collectBookingInfo(bookDataToPass);
  }

}
