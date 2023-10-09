import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvOtherComponent } from './inv-other.component';

describe('InvOtherComponent', () => {
  let component: InvOtherComponent;
  let fixture: ComponentFixture<InvOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvOtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
