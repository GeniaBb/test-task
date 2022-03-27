import { CraneType } from './crane-type.enum';

export interface Shift {
  id: number;
  responsible: string;
  start: string;
  end: string;
  craneType: CraneType;
  loaded: number;
  shipped: number;
}
