import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoolaBillsComponent } from './moola-bills.component';

describe('MoolaBillsComponent', () => {
  let component: MoolaBillsComponent;
  let fixture: ComponentFixture<MoolaBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoolaBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoolaBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
