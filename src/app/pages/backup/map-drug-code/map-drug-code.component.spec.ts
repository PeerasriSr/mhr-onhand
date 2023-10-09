import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDrugCodeComponent } from './map-drug-code.component';

describe('MapDrugCodeComponent', () => {
  let component: MapDrugCodeComponent;
  let fixture: ComponentFixture<MapDrugCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapDrugCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDrugCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
