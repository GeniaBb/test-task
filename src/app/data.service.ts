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
      start: '2022-03-26T12:50',
      end: '2022-03-27T00:50',
      craneType: CraneType.single,
      loaded: 10,
      shipped: 0,
      cranes: [
        {
          trucks: [
            {
              truck: 'truck1',
              loaded: 10,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      responsible: 'Петров П.П.',
      start: '2022-03-27T00:50',
      end: '2022-03-27T12:50',
      craneType: CraneType.double,
      loaded: 12,
      shipped: 1,
      cranes: [
        {
          trucks: [
            {
              truck: 'truck1',
              loaded: 12,
            },
          ],
        },
        {
          trucks: [
            {
              truck: 'truck2',
              shipped: 1,
            },
          ],
        },
      ],
    },
  ];

  removeShift(removableShift: Shift) {
    const result = this.shifts.filter((item) => item.id !== removableShift.id);
    this.shifts = result;
  }

  getShifts(): Observable<Shift[]> {
    return of(this.shifts);
  }

  createShift(shift: Shift): void {
    shift.id = this.shifts[this.shifts.length - 1].id + 1;
    this.shifts.push(shift);
  }
}
