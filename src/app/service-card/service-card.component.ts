import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent implements OnInit {

  @Input() service:any;
  @Input() selectedCard:any;
  service_duration:string;
  
  constructor() {}

  ngOnInit() {
    if (this.service.duration){
      this.service_duration = this.service.duration;
    }
    else {
      this.service_duration = '';
    }
    
  }

}
