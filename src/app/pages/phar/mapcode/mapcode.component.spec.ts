import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapcodeComponent } from './mapcode.component';

describe('MapcodeComponent', () => {
  let component: MapcodeComponent;
  let fixture: ComponentFixture<MapcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
