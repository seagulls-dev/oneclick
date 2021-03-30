import { Employee, PositionScore } from '../../services/employee.model';

export interface ExtraEmployee {
  employee: Employee;
  scoresList: PositionScore[];
  lastUpdatedString: string;
  softFilter?: boolean; // This will hide it via css on the view
}

export interface EmployeeContainer {
  employee: Employee;
  softFilter?: boolean;


  // These values don't have to be included, but can be added later.
  // This is to allow filtering/sorting before I evaluate these more expensive values.
  scoresList?: PositionScore[];
  lastUpdatedString?: string;
}
