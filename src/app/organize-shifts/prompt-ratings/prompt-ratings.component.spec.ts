import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptRatingsComponent } from './prompt-ratings.component';

describe('PromptRatingsComponent', () => {
  let component: PromptRatingsComponent;
  let fixture: ComponentFixture<PromptRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
