import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointsComponent } from './appoints.component';

describe('AppointsComponent', () => {
  let component: AppointsComponent;
  let fixture: ComponentFixture<AppointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
