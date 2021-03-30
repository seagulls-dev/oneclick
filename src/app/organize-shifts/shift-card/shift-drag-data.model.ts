import { Shift } from '../shift.model';

export interface ShiftDragData {
  shift: Shift;
}
export function isShiftDragData(obj: ShiftDragData|any): obj is ShiftDragData {
  // Just check if the properties of the interface exist
  return obj && obj.shift && true || false;
}
