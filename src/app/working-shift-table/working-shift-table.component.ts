import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { Shift } from '../types/shift.interface';

@Component({
  selector: 'app-working-shift-table',
  templateUrl: './working-shift-table.component.html',
  styleUrls: ['./working-shift-table.component.scss'],
})
/**
 * Компонент таблицы смен
 */
export class WorkingShiftTableComponent implements OnInit {
  constructor(private readonly dataService: DataService) {}

  /**
   * Заголовки колонок таблицы
   */
  columns: string[] = [
    'ФИО',
    'Начало',
    'Окончание',
    'Тип крана',
    'Погружено тонн',
    'Отгружено тонн',
    '',
  ];

  /**
   * Получение данных для таблицы
   * @returns данные для таблицы
   */
  getData(): Observable<Shift[]> {
    return this.dataService.getShifts();
  }

  ngOnInit(): void {}
}
