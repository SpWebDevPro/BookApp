import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotPickerComponent } from './slot-picker.component';

describe('SlotPickerComponent', () => {
  let component: SlotPickerComponent;
  let fixture: ComponentFixture<SlotPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
