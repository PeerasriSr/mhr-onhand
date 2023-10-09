import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDrugexpComponent } from './report-drugexp.component';

describe('ReportDrugexpComponent', () => {
  let component: ReportDrugexpComponent;
  let fixture: ComponentFixture<ReportDrugexpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDrugexpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDrugexpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
