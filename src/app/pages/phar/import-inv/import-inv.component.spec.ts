import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportInvComponent } from './ImportInvComponent';

describe('ImportInvComponent', () => {
  let component: ImportInvComponent;
  let fixture: ComponentFixture<ImportInvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportInvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
