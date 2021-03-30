import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteMoolaComponent } from './infinite-moola.component';

describe('InfiniteMoolaComponent', () => {
  let component: InfiniteMoolaComponent;
  let fixture: ComponentFixture<InfiniteMoolaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfiniteMoolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteMoolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
