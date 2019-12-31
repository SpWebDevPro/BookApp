import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentOfferComponent } from './agent-offer.component';

describe('AgentOfferComponent', () => {
  let component: AgentOfferComponent;
  let fixture: ComponentFixture<AgentOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
