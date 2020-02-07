import { Injectable } from '@angular/core';
import { Navigation } from './navigation.model';
import { dbService } from './indexeddb.service';


@Injectable()
export class NavigationService {

    constructor(
      private dbService:dbService
    ){}

    createNavigationObject(navId, route, response){
      return new Navigation (navId, route, response)
    }

    displayNavigationInfo(event){
        console.group("NavigationStart Event");
          console.log("navigation id: ", event.id);
          console.log("route:", event.url);
          console.log("trigger:", event.navigationTrigger);
          if (event.restoredState){
            console.warn("restoring navigation id:", event.restoredState.navigationId);
          }
          console.groupEnd();
    }

    SaveNavigationInfo(navObject){
      this.dbService.addServerResponseToDataBase(navObject);
    }


    



}