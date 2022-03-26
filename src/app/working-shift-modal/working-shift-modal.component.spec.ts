import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingShiftModalComponent } from './working-shift-modal.component';

describe('WorkingShiftModalComponent', () => {
  let component: WorkingShiftModalComponent;
  let fixture: ComponentFixture<WorkingShiftModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingShiftModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingShiftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
