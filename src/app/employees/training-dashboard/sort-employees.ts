import { ExtraEmployee } from './extra-employee.model';
import { SortOption } from './sort-option.model';

export function sortEmployees(records: ExtraEmployee[], sort: SortOption): ExtraEmployee[] {
  // console.log(`Sorting ${records.length} records`, sort);
  const isPositionSort = sort.id[0] === "@"; // positionId's always start with '@'

  const tests: SortOption[] = [
    sort,

    // other backup sorts for consistent ordering
    {id:"name"},
    {id:"highestPosition", desc: true}
  ];

  let sortedEmployees: ExtraEmployee[] = records.sort((a, b) => {
    for(let tryTest of tests){
      let result = test(tryTest.id, tryTest.desc);
      if(result !== 0)
        return result;
    }

    return 0;

    function test(id: string, descending?: boolean): number {
      var value: number = 0;

      if(isPositionSort){
        const aScore = a.employee.scores[id] && a.employee.scores[id].rating || 0;
        const bScore = b.employee.scores[id] && b.employee.scores[id].rating || 0;

        if(aScore && bScore)
          value = aScore - bScore;
        else if(aScore || bScore)
          return bScore - aScore;
        else
          return 0;
      }else {
        switch(id){
          case "name":
          case "fullName":
            const fullName = id === 'fullName';
            value = a.employee.getName(fullName).localeCompare(b.employee.getName(fullName));
            break;
          case "mooLa":
          case "mooLaBudget":
          case "mooLaDisbursed":
          case "lastUpdated":
            const aValue = +(a.employee[id] || 0);
            const bValue = +(b.employee[id] || 0);

            // If either of the values of zero, but not both,
            // sort the zero to the bottom, even if descending
            if(!aValue !== !bValue)
              return bValue - aValue;

            value = aValue - bValue;
            break;
          case "highestPosition":
            value = a.employee.getHighestPositionIndex() - b.employee.getHighestPositionIndex();
            break;
          default:
            throw Error(`Unrecognized test: ${id}`);
        }
      }

      return descending ? value*-1 : value;
    }
  });

  return sortedEmployees;
}
