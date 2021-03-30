import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveWidgetComponent } from './save-widget.component';

describe('SaveWidgetComponent', () => {
  let component: SaveWidgetComponent;
  let fixture: ComponentFixture<SaveWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
