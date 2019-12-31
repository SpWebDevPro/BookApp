import { PipeTransform, Pipe } from '@angular/core';
import { HelperCalendarService } from './helper-calendar.service';

@Pipe({
    name:'minToHours'
})
export class MinToHoursPipe implements PipeTransform {

    constructor(
        private helperCalendarService:HelperCalendarService
    ){}

    transform(value:any){
        return this.helperCalendarService.convertMinToHours(value)
    }
}