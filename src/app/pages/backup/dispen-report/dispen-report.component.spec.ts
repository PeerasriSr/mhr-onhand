import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispenReportComponent } from './dispen-report.component';

describe('DispenReportComponent', () => {
  let component: DispenReportComponent;
  let fixture: ComponentFixture<DispenReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispenReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispenReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
