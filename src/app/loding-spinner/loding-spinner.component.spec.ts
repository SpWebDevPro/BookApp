import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LodingSpinnerComponent } from './loding-spinner.component';

describe('LodingSpinnerComponent', () => {
  let component: LodingSpinnerComponent;
  let fixture: ComponentFixture<LodingSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LodingSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LodingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
