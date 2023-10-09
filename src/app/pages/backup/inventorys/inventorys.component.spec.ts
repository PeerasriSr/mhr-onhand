import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorysComponent } from './inventorys.component';

describe('InventorysComponent', () => {
  let component: InventorysComponent;
  let fixture: ComponentFixture<InventorysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
