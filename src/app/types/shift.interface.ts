import { CraneType } from './crane-type.enum';
import { Crane } from './crane.interface';

/**
 * Смена
 */
export interface Shift {
  /**
   * Идентификатор смен
   */
  id: number;
  /**
   * ФИО ответственного смены
   */
  responsible: string;
  /**
   * Дата и время начала смены
   */
  start: string;
  /**
   * Дата и время конца смены
   */
  end: string;
  /**
   * Тип крана
   */
  craneType: CraneType;
  /**
   * Пгруженные тонны
   */
  loaded: number;
  /**
   * Отгруженные тонны
   */
  shipped: number;
  /**
   * Данные  о кранах
   */
  cranes: Crane[];
}
