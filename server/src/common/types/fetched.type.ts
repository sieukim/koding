export type Fetched<T, K extends keyof T> = T & {
  [k in K]-?: Exclude<T[k], undefined>;
};
