import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class PwaService {

    catched_prompt_installation = new Subject<any>();

    constructor(private swUpdate:SwUpdate){
    }

    dispatchPromptInstallEvent(value:any){
        // console.log('the event is dispatched from pwa', value);
        return this.catched_prompt_installation.next(value);
    }

    promptInstallation(deferredPrompt) {
        // console.log('deferredPrompt in promptInstallation in pwa service promtIntsllation function:', deferredPrompt);
        deferredPrompt.prompt();
        deferredPrompt.userChoice
          .then((choiceResult) => {
            console.log('choiceResult:', choiceResult);
            if ( choiceResult.outcome === 'accepted'){
              //TODO: place a message that the app is being installed in the screen
              console.log("l'utilisateur a accepté l'installation sur le home screen")
            } else {
              console.log("l'utilisateur ne veut pas procéder à l'installation pour l'instant")
            }
            deferredPrompt = null;
          })
      }

    promptUpdateTheApp(){
        if (this.swUpdate.isEnabled){
            this.swUpdate.available.subscribe(() => {
                if (confirm("Une nouvelle version de l'application est disponible, souhaitez vous effectuer la mise à jour?")){
                    window.location.reload();
                }
            })
        }
    }
}