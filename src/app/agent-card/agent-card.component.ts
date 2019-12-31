import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-agent-card',
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss']
})
export class AgentCardComponent implements OnInit {

  @Input() agent:any;
  @Input() selectedCard:any;
  
  constructor() {}

  ngOnInit() {
  }
  
}
