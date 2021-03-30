import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDashboardComponent } from './training-dashboard.component';

describe('TrainingDashboardComponent', () => {
  let component: TrainingDashboardComponent;
  let fixture: ComponentFixture<TrainingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
