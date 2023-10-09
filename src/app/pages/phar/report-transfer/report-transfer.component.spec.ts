import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTransferComponent } from './report-transfer.component';

describe('ReportTransferComponent', () => {
  let component: ReportTransferComponent;
  let fixture: ComponentFixture<ReportTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
