import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlingErrorsComponent } from './handling-errors.component';

describe('HandlingErrorsComponent', () => {
  let component: HandlingErrorsComponent;
  let fixture: ComponentFixture<HandlingErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandlingErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandlingErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
