import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsWidgetComponent } from './stars-widget.component';

describe('StarsWidgetComponent', () => {
  let component: StarsWidgetComponent;
  let fixture: ComponentFixture<StarsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
