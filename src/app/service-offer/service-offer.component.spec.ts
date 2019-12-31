import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOfferComponent } from './service-offer.component';

describe('ServiceOfferComponent', () => {
  let component: ServiceOfferComponent;
  let fixture: ComponentFixture<ServiceOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
