import { RoleId } from '../services/employee.model';

export interface MooLaConfig {
  bills?: MooLaBill[];
  weeklyBudgets?: WeeklyBudget,
  maxSupplyTransactionAmount?: number; // The greatest value a single supply transaction can be
}

export interface MooLaBill {
  value: number;
  filename: string; // the file will be searched for in the assets/moola folder
  // a smaller version is expected to be included with a name that inserts ".small" before the file ending
  // ex: moola1.jpg ==> moola1.small.jpg

  reserved?: boolean; // Hidden from normal use; only some people can distribute these
  // Ex: $2 bill and the $50
}

// Each permission can have a different budget. The greatest of applicable bugets will be awarded each week.
// If no budget is provided, the greatest of all lower budgets will be provided, or 0
// Directors are assumed to grant out unlimited MooLa
export type WeeklyBudget = { [K in RoleId]?: number }

export function isBill(obj: MooLaBill|any): obj is MooLaBill {
  // Check for the properties of a bill to distinguish it
  return obj && obj.value && obj.filename && true || false;
}
