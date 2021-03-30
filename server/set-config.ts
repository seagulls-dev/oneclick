import * as cloner from 'cloner';

export function setConfig(genericConfig?: any, moreSpecificConfig?: any) {
  var fullConfig = {isGetConfig: true};
  for (let config of [genericConfig, moreSpecificConfig]) {
    if (config === undefined) {
      continue;
    }
    if (typeof config === 'object') {
      cloner.deep.merge(fullConfig, config);
    } else if (typeof config === 'function') {
      let returnedValue = config();
      if (returnedValue.isGetConfig) {
        cloner.deep.merge(fullConfig, returnedValue);
      } else {
        throw TypeError("The function passed to setConfig must be a getConfig function");
      }
    } else {
      throw TypeError("Only objects and getConfig functions can be passed into setConfig");
    }
  }

  return function getConfig(field?: string, defaultValue?: any) {
    if(field === undefined)
      return fullConfig;
    else if(typeof field !== 'string')
      throw TypeError("field is not of a supported type!");

    let props = field.split('.');
    var obj = fullConfig;

    for(let prop of props){
      if(obj[prop] !== undefined)
        obj = obj[prop];
      else if(defaultValue !== undefined)
        return defaultValue;
      else
        throw Error(`Could not find prop '${field}' in config:${JSON.stringify(fullConfig, null, 2)}, and no defaultValue was provided`);
    }

    return obj;
  }
}
