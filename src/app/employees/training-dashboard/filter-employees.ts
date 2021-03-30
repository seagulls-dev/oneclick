import { EmployeeContainer } from './extra-employee.model';
import { FilterModes, FilterOption } from './filter-option.model';
import { Employee } from 'src/app/services/employee.model';
import { stringContains, cleanStringForSearch } from 'src/app/helpers/snippet';

export function filterEmployees(records: EmployeeContainer[], filter: FilterOption): EmployeeContainer[] {
  // console.log(`Filtering ${records.length} records`, filter);

  // TODO: optimize this filtering algorithm by restructuring the filter to look for 'always' matches first
  // For now, check if there are any 'always' searches, and behave differently if so
  let alwaysFilter = false;
  findAlways: {
    if(!filter.search || !filter.search.text)
      for(let objName of ['groups', 'roles'])
        for(let filterKey in (filter[objName] || {}))
          if(filter[objName][filterKey] === FilterModes.alwaysInclude){
            alwaysFilter = true;
            break findAlways;
          }
  }

  // cache this up here for use down below
  const cleanSearchString = filter.search && cleanStringForSearch(filter.search.text) || "";


  // if we are performing a soft filter, just change the property on each record;
  // otherwise, place/remove them from the results
  if(filter.soft){
    for(let record of records)
      record.softFilter = !shouldInclude(record.employee);

    return records;
  }else{
    let filteredEmployees: EmployeeContainer[] = [];

    for(let record of records)
      if(shouldInclude(record.employee))
          filteredEmployees.push(record);

    return filteredEmployees;
  }

  function shouldInclude(employee: Employee): boolean {
    // cache the regular value while we search
    let cachedResult: boolean;

    // This is a set of pairs: [FilterMode1, boolean1, FilterMode2, boolean2, FilterMode3, boolean3 ...]
    // They will be evaulated and the final result will give the anser
    let queue: (FilterModes|boolean)[] = [];

    // We can do these both with the same code **because** they are structured so similarily
    // And also because we said that the roles will ALWAYS be interpreted strictly
    for(let filterSet of ['roles', 'groups']){
      if(filter[filterSet]){
        for(let filterId in filter[filterSet]){
          const filterMode = filter[filterSet][filterId];
          const hasTest = employee[filterSet][filterId];

          queue.push(filterMode, hasTest);
        }
      }
    }

    if(filter.destination){
      const hasDestination = employee.hasDestination(filter.destination);
      const include = hasDestination ||
        (hasDestination === undefined && employee.groups.newbie);
      queue.push(FilterModes.mustInclude, include);
    }

    if(filter.mooLa){
      queue.push(filter.mooLa,  employee.mooLa > 0 ||
                                employee.mooLaBudget > 0 ||
                                employee.mooLaDisbursed > 0);
    }

    for(let i=0;i<queue.length;i+=2){
      const filterMode = queue[i] as FilterModes;
      const hasTest = queue[i + 1] as boolean;

      const result = evaluateFilter(filterMode, hasTest);
      if(result === true){
        if(alwaysFilter)    return true;
        else                console.log(`Did not alwaysInclude ${employee.name} because the flag was not turned on. This might be a bug.`);
      }else if(result === false){
        if(alwaysFilter)    cachedResult = false;
        else                return false;
      }
    }

    if(cachedResult !== undefined)
      return cachedResult;

    if(cleanSearchString.length){
      // If they don't pass the search, they don't go according to the spec
      if (stringContains(employee.name, cleanSearchString) ||
          stringContains(employee.nickname, cleanSearchString))
            return true;

      return false;
    }

    return true; // When we're in always filter mode, turn it around to defa
  }
}

// `true` means they go straight in.
// `false` means they definitely fail
// `undefined` means we don't yet know
function evaluateFilter(filterMode: FilterModes, hasTest: boolean): boolean|undefined {
  if(filterMode === FilterModes.alwaysInclude && hasTest)
    return true;
  else if(filterMode === FilterModes.cannotInclude && hasTest)
    return false;
  else if(filterMode === FilterModes.mustInclude && !hasTest)
    return false;

  return undefined;
}
