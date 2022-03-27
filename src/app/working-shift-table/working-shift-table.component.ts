import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { Shift } from '../types/shift.interface';

@Component({
  selector: 'app-working-shift-table',
  templateUrl: './working-shift-table.component.html',
  styleUrls: ['./working-shift-table.component.scss'],
})
export class WorkingShiftTableComponent implements OnInit {
  constructor(private readonly dataService: DataService) {}

  columns: string[] = [
    'ФИО',
    'Начало',
    'Окончание',
    'Тип крана',
    'Погружено тонн',
    'Отгружено тонн',
    '',
  ];

  getData(): Observable<Shift[]> {
    return this.dataService.getShifts();
  }

  removeShift(el: any) {
    this.dataService.removeShift(el);
  }

  ngOnInit(): void {}
}
