import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvUpdateComponent } from './inv-update.component';

describe('InvUpdateComponent', () => {
  let component: InvUpdateComponent;
  let fixture: ComponentFixture<InvUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
