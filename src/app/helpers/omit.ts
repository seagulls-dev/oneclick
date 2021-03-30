// https://stackoverflow.com/a/48216010/2844859
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;