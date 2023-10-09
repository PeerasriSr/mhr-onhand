import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugSettingComponent } from './drug-setting.component';

describe('DrugSettingComponent', () => {
  let component: DrugSettingComponent;
  let fixture: ComponentFixture<DrugSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
