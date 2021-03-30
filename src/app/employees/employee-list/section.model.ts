import { Employee } from '../../services/employee.model';

export interface Section {
  title: string;
  employees: Employee[];
}