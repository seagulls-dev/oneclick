import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryEventComponent } from './history-event.component';

describe('HistoryEventComponent', () => {
  let component: HistoryEventComponent;
  let fixture: ComponentFixture<HistoryEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
