import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpdrugComponent } from './expdrug.component';

describe('ExpdrugComponent', () => {
  let component: ExpdrugComponent;
  let fixture: ComponentFixture<ExpdrugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpdrugComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpdrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
