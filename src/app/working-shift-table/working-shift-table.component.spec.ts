import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingShiftTableComponent } from './working-shift-table.component';

describe('WorkingShiftTableComponent', () => {
  let component: WorkingShiftTableComponent;
  let fixture: ComponentFixture<WorkingShiftTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingShiftTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingShiftTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
