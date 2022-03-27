import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CraneType } from './types/crane-type.enum';
import { Shift } from './types/shift.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  shifts: Shift[] = [
    {
      id: 1,
      responsible: 'Иванов И.И.',
      start: '2022-03-26T12:50:37Z',
      end: '2022-03-27T00:50:37Z',
      craneType: CraneType.single,
      loaded: 10,
      shipped: 2,
    },
    {
      id: 2,
      responsible: 'Петров И.И.',
      start: '2022-03-27T00:50:37Z',
      end: '2022-03-27T12:50:37Z',
      craneType: CraneType.double,
      loaded: 12,
      shipped: 1,
    },
  ];

  removeShift(removableShift: Shift) {
    const result = this.shifts.filter((item) => item.id !== removableShift.id);
    this.shifts = result;
  }

  getShifts(): Observable<Shift[]> {
    return of(this.shifts);
  }
}
