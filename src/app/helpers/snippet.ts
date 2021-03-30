import { DocumentSnapshot, DocumentReference } from '@firebase/firestore-types';

// Each of these functions perform the mathematical operation with options:
// multipleOf is provided, then places is ignored, and the number is operated based
// on the multiple of the value
// if places is provided, the number will be operated n places to the right of the decimal
// negetive allowed
// otherwise, it will go to a plain integer
function _getModifier(places?: number, multipleOf?: number): number {
  if(multipleOf)
    return 1 / (multipleOf || 1);

  return Math.pow(10, places || 0);
}
export function floor(number: number, places?: number, multipleOf?: number): number {
  const modifier = _getModifier(places, multipleOf);
  return Math.floor(number * modifier) / modifier
}
export function round(number: number, places?: number, multipleOf?: number): number {
  const modifier = _getModifier(places, multipleOf);
  return Math.round(number * modifier) / modifier
}
export function ceil(number: number, places?: number, multipleOf?: number): number {
  const modifier = _getModifier(places, multipleOf);
  return Math.ceil(number * modifier) / modifier
}

// returns a random element from an array of items
export function randomElement(arr: any[]): any {
  // https://css-tricks.com/snippets/javascript/select-random-item-array/
  return arr[Math.floor(Math.random() * arr.length)];
}

// return the index of the greatest numerical value in the array
export function indexOfMax(arr: number[]): number {
  // https://stackoverflow.com/a/11301464/2844859
  if (arr.length === 0)
    return -1;

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

// given a string, tests whether or not it is a valid URL
export function isValidUrl(str: string): boolean {
  // https://stackoverflow.com/a/5717133/2844859
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

type MixedCaseString = string;
type LowerCaseString = string;
export function stringContains(search: MixedCaseString, find: LowerCaseString): boolean {
  // This function returns a boolean indicating if `find` is found within `search`.
  // The search is performed safely. If an argument is missing, false will be returned;
  // It is assumed that `find` is already lower case.
  // `search` will be lowercased to match

  // An empty string cannot contain any value
  if (!search || !find)
    return false;

  // Lowercase everything for case-insensitive searching
  const lowerStr = search.toLowerCase();

  // Do the search and return the result
  return lowerStr.indexOf(find) > -1;
}
export function cleanStringForSearch(str: MixedCaseString): LowerCaseString {
  // https://stackoverflow.com/a/1981366/2844859

  // the resulting string will be all lowercase and
  // will be stripped of all leading/trailing/duplicate whitespaces

  // It is done safely such that if the string doesn't exist or has no length,
  // the empty string is returned

  return str && str.trim().toLowerCase().replace(/\s\s+/g, ' ') || "";
}

export function insertIntoString(str: string, index: number, stringToInsert: string): string {
  // https://stackoverflow.com/a/4314044/2844859
  return str.slice(0, index) + stringToInsert + str.slice(index);
}

// Takes any string and returns the camelCase version of it
export function camelize(str: string): string {
  // https://stackoverflow.com/a/2970667/2844859
  return str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

// Takes a string destined to be a Firestore Field and strips it of
// `*[]. according to Firebase best practices
export function cleanFirestoreFieldName(str: string): string {
  // https://cloud.google.com/firestore/docs/best-practices#field_names
  return str.replace(/[\`\*\[\]\.]/g, "");
}

// If the items is an array, returns it; otherwise wraps it in an array
export function toArray<T>(input: T[]|T): T[] {
  return Array.isArray(input) ? input : [input];
}

/** Notes:
 * Modifies `partiallyConstructedThis` by adding in all the properties of `data`
 * Unless override is truthy, values will be pulled in without overriding anything that has been built already.
 * NOTE: properties in nested objects must be taken care of manually
 *
 * If no `initialThis` is provided, a new object will be create, filled in, and returned
 *
 * A `ref` property will be included if it isn't already
 * An `id` property will be included if it ins't already as the id of the `ref`
 * Firestore Timestamp objects are converted to Dates
 * */
export function isDocumentSnapshot(input: DocumentSnapshot|any): input is DocumentSnapshot {
  return <DocumentSnapshot>input.exists !== undefined &&
    typeof <DocumentSnapshot>input.data === "function";
}
export function finishConstruction<T>(initialThis: any|null, firebaseDocOrData: DocumentSnapshot|DataObject, override?: boolean): T {
  const creatingObj = !initialThis;
  if(creatingObj)
    initialThis = {};

  if(!initialThis.ref && firebaseDocOrData.ref)
    initialThis.ref = firebaseDocOrData.ref;

  if(!initialThis.id && initialThis.ref)
    initialThis.id = initialThis.ref.id;

  var data: object;
  if(isDocumentSnapshot(firebaseDocOrData))
    data = firebaseDocOrData.data() || {};
  else
    data = firebaseDocOrData;

  for(let prop in data)
    if(override || initialThis[prop] === undefined){
      // Convert Timestamps into dates
      const value = data[prop];
      initialThis[prop] = (value && value.toDate) ? value.toDate() : value;
    }

  return initialThis;
}
export interface DataObject {
  ref?: DocumentReference;
  [fieldName: string]: any
}

export function cleanEmail(email: string): string|false {
  if(!email)
    return false;

  // https://www.w3resource.com/javascript/form/email-validation.php
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  if(!email.match(mailFormat))
    return false;

  return email.toLowerCase().replace(/\s/g, "");
}
