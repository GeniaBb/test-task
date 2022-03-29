import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
})
/**
 * Форматирование даты
 */
export class LocalDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    // Форматирование даты в формате дд.мм.гг, чч:мм
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
