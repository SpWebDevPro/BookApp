import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayInMonthComponent } from './day-in-month.component';

describe('DayInMonthComponent', () => {
  let component: DayInMonthComponent;
  let fixture: ComponentFixture<DayInMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayInMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayInMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
