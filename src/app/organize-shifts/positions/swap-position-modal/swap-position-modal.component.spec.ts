import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapPositionModalComponent } from './swap-position-modal.component';

describe('SwapPositionModalComponent', () => {
  let component: SwapPositionModalComponent;
  let fixture: ComponentFixture<SwapPositionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapPositionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapPositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
