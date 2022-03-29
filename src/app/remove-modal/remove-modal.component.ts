import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Shift } from '../types/shift.interface';

@Component({
  selector: 'app-remove-modal',
  templateUrl: './remove-modal.component.html',
  styleUrls: ['./remove-modal.component.scss'],
})
export class RemoveModalComponent implements OnInit {
  isModalVisible: boolean = false;
  constructor(private readonly dataService: DataService) {}
  shiftForRemove: Shift | null = null;

  ngOnInit(): void {}

  show(shift: Shift): void {
    this.isModalVisible = true;
    this.shiftForRemove = shift;
  }
  hide(): void {
    this.isModalVisible = false;
    this.shiftForRemove = null;
  }

  removeShift() {
    if (this.shiftForRemove) {
      this.dataService.removeShift(this.shiftForRemove);
    }
    this.hide();
  }
}
