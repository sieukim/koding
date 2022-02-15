export enum SortOrder {
  ASC = 1,
  DESC = -1,
}

export type SortOption<Model> = {
  [k in keyof Partial<Model>]: SortOrder;
};
