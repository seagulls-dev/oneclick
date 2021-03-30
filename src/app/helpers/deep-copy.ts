/*
* DeepCopy class helps to copy an Original Array or an Object without impacting on original data
* https://stackoverflow.com/a/53222303/2844859


* use as DeepCopy.copy(data);
*/

export class DeepCopy {
  static copy(data: any): any {
    let node;
    if (Array.isArray(data)) {
      node = data.length > 0 ? data.slice(0) : [];
      node.forEach((e, i) => {
        if (
          (typeof e === 'object' && e !== {}) ||
          (Array.isArray(e) && e.length > 0)
        ) {
          node[i] = DeepCopy.copy(e);
        }
      });
    } else if (data && typeof data === 'object') {
      node = data instanceof Date ? data : Object.assign({}, data);
      Object.keys(node).forEach((key) => {
        if (
          (typeof node[key] === 'object' && node[key] !== {}) ||
          (Array.isArray(node[key]) && node[key].length > 0)
        ) {
          node[key] = DeepCopy.copy(node[key]);
        }
      });
    } else {
      node = data;
    }
    return node;
  }
}
