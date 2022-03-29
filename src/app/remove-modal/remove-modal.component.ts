import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Shift } from '../types/shift.interface';

@Component({
  selector: 'app-remove-modal',
  templateUrl: './remove-modal.component.html',
  styleUrls: ['./remove-modal.component.scss'],
})
/**
 * Модал удаления смены
 */
export class RemoveModalComponent {
  /**
   * Виден ли модал
   */
  isModalVisible: boolean = false;

  /**
   * Удаляемая смена
   */
  shiftForRemove: Shift | null = null;
  constructor(private readonly dataService: DataService) {}

  /**
   * Показ модального окна
   */
  show(shift: Shift): void {
    this.isModalVisible = true;
    this.shiftForRemove = shift;
  }

  /**
   * Скрытие модального окна
   */
  hide(): void {
    this.isModalVisible = false;
    this.shiftForRemove = null;
  }

  /**
   * Удаление смены из таблицы
   */
  removeShift() {
    if (this.shiftForRemove) {
      this.dataService.removeShift(this.shiftForRemove);
    }
    this.hide();
  }
}
