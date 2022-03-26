import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-working-shift-modal',
  templateUrl: './working-shift-modal.component.html',
  styleUrls: ['./working-shift-modal.component.scss'],
})
export class WorkingShiftModalComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit(): void {
    window.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  isModalVisible: boolean = false;

  show(): void {
    this.isModalVisible = true;
  }

  hide(): void {
    this.isModalVisible = false;
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };
}
