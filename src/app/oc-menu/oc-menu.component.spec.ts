import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcMenuComponent } from './oc-menu.component';

describe('OcMenuComponent', () => {
  let component: OcMenuComponent;
  let fixture: ComponentFixture<OcMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
