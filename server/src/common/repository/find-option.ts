export type FindOption<Model> = {
  [k in keyof Partial<Model>]:
    | {
        eq: Model[k];
      }
    | {
        lt: Model[k];
      }
    | {
        lte: Model[k];
      }
    | {
        gt: Model[k];
      }
    | {
        gte: Model[k];
      }
    | {
        in: Array<Model[k]> | Model[k];
      };
};
