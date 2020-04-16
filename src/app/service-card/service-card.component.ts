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
  service_pricemin:string;
  displaydevise:Boolean = true;
  
  
  constructor() {}

  ngOnInit() {
    if (this.service.duration){
      this.service_duration = this.service.duration;
    }
    else {
      this.service_duration = '';
    }
    if (this.service.price_min === '0.00'){
      this.service_pricemin = '';
      this.displaydevise = false;
    }
    else {
      this.service_pricemin = this.service.price_min;
    }
  }
    


}
