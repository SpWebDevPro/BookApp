import { Injectable } from '@angular/core';


@Injectable()

export class HelperCalendarService {

    convertMinToHours(num){
        let hours = Math.floor(num/60);
        let minutes = num % 60;
        return this.checkHourFormat(hours,minutes);
      }

    convertHourstoMin(string){
        let h = parseInt(string.substring(0,2),10);
        let m = parseInt(string.substring(3,5),10);
        let result = h*60+m;
    return result.toString();
    }
    
    checkHourFormat(hours,minutes){

        let HHmmString = `${hours}:${minutes}`;
        let reg = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
        let reg_front = new RegExp(/^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
        let reg_end = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-9]$/);
        let reg_both = new RegExp(/^([0-9]):[0-9]$/);
        if (reg.test(HHmmString)){
            return HHmmString;
        } else {
            if ( reg_both.test(HHmmString)){
                return `0${hours}:0${minutes}`;
            }
            else {
                if (reg_front.test(HHmmString)){
                return `0${HHmmString}`;
                }
                if (reg_end.test(HHmmString)){
                return `${hours}:0${minutes}`;
                }
                else {
                    // console.log('on a oublié un cas');
                }
            }
        }
        }

}







// export class HelperCalendarService {

//     convertMinToHours(num){
//         let hours = Math.floor(num/60);
//         let minutes = num % 60;
//         let result = `${hours}:${minutes}`;
//         return this.checkHourFormat(result);
//       }

//     convertHourstoMin(string){
//     let h = parseInt(string.substring(0,2),10);
//     let m = parseInt(string.substring(3,5),10);
//     let result = h*60+m;
//     return result.toString();
//     }
    
//     checkHourFormat(HHmmString){
//     let reg = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
//     let reg_front = new RegExp(/^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
//     let reg_end = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0]$/);
//     if (reg.test(HHmmString)){
//         return HHmmString;
//     } else {
//         if (reg_front.test(HHmmString)){
//         return `0${HHmmString}`;
//         }
//         if (reg_end.test(HHmmString)){
//         return `${HHmmString}0`;
//         }
//         else {
//         return `0${HHmmString}0`;
//         }
//     }
//     }



// }