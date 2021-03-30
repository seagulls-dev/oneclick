import { Employee } from '../../services/employee.model';

export type SectionTitle = "newbies"|"teammembers"|"leaders";

export function sortEmployees(section: SectionTitle, sort: string, employees: Employee[]): Employee[] {
  const sortedEmployees = employees.sort((a, b) => {
    switch(sort){
      case "lastUpdated":
        return +b.lastUpdated - +a.lastUpdated;
      case "name":
        return a.getName().localeCompare(b.getName());
      default:
        throw Error(`[sort-employees]: Sort ${sort} is not recognized`);
    }
  });

  return sortedEmployees;
}
