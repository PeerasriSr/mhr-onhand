import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransReportComponent } from './trans-report.component';

describe('TransReportComponent', () => {
  let component: TransReportComponent;
  let fixture: ComponentFixture<TransReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
