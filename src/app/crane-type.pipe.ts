import { Pipe, PipeTransform } from '@angular/core';
import { CraneType } from './types/crane-type.enum';

@Pipe({
  name: 'craneType',
})
/**
 * Форматирование типа крана
 */
export class CraneTypePipe implements PipeTransform {
  transform(value: CraneType): string {
    switch (value) {
      case CraneType.single:
        return 'Одинарный';
      case CraneType.double:
        return 'Двойной';
      default:
        return '';
    }
  }
}
