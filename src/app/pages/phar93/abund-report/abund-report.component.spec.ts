import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbundReportComponent } from './abund-report.component';

describe('AbundReportComponent', () => {
  let component: AbundReportComponent;
  let fixture: ComponentFixture<AbundReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbundReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbundReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
