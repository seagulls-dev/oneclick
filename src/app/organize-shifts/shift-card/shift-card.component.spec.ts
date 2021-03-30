import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCardComponent } from './shift-card.component';

describe('ShiftCardComponent', () => {
  let component: ShiftCardComponent;
  let fixture: ComponentFixture<ShiftCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
