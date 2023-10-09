import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportClassifyComponent } from './report-classify.component';

describe('ReportClassifyComponent', () => {
  let component: ReportClassifyComponent;
  let fixture: ComponentFixture<ReportClassifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportClassifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportClassifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
