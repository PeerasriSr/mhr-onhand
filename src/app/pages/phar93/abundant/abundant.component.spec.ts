import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbundantComponent } from './abundant.component';

describe('AbundantComponent', () => {
  let component: AbundantComponent;
  let fixture: ComponentFixture<AbundantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbundantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbundantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
