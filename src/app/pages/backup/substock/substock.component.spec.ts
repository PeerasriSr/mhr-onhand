import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstockComponent } from './substock.component';

describe('SubstockComponent', () => {
  let component: SubstockComponent;
  let fixture: ComponentFixture<SubstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
