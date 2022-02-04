import { FindOption } from "./find-option";
import { Document, FilterQuery, Model, Types } from "mongoose";
import { SortOption } from "./sort-option";

export abstract class MongooseBaseRepository<
  DomainModel,
  ModelDocument extends Document,
> {
  protected constructor(
    protected readonly toModel: (document: ModelDocument) => DomainModel,
    protected readonly fromModel: (
      model: DomainModel,
      mongooseModel: Model<ModelDocument>,
    ) => ModelDocument,
    private readonly mongooseModel: Model<ModelDocument>,
    protected readonly shouldConvertedToObjectIdFields: (keyof DomainModel)[] = [],
    protected readonly virtualPrimaryKeyName?: keyof ModelDocument,
  ) {}

  abstract persist(model: DomainModel): Promise<DomainModel>;

  abstract update(model: DomainModel): Promise<DomainModel>;

  abstract remove(model: DomainModel): Promise<boolean>;

  async findAll(
    findOption: FindOption<DomainModel>,
    sortOption?: SortOption<DomainModel>,
    fetchSize?: number,
  ): Promise<DomainModel[]> {
    return this.findAllWith(findOption, undefined, sortOption, fetchSize);
  }

  async findAllWith(
    findOption: FindOption<DomainModel>,
    populate: (keyof DomainModel)[],
    sortOption?: SortOption<DomainModel>,
    fetchSize?: number,
  ): Promise<DomainModel[]> {
    const findQuery: FilterQuery<ModelDocument> =
      this.parseFindOption(findOption);
    const sortQuery = this.parseSortOption(sortOption);
    let query = this.mongooseModel.find(findQuery);
    if (populate) query = query.populate(populate);
    if (sortOption) query = query.sort(sortQuery);
    if (fetchSize != undefined) query = query.limit(fetchSize);
    const documents = (await query.exec()) ?? ([] as ModelDocument[]);
    return documents.map(this.toModel);
  }

  async updateAll(
    findOption: FindOption<DomainModel>,
    updateData: Partial<DomainModel>,
  ) {
    const findQuery: FilterQuery<ModelDocument> =
      this.parseFindOption(findOption);
    const query = this.mongooseModel.updateMany(findQuery, updateData);
    const result = await query.exec();
    return result.modifiedCount;
  }

  async updateOne(
    findOption: FindOption<DomainModel>,
    updateData: Partial<DomainModel>,
  ) {
    const findQuery: FilterQuery<ModelDocument> =
      this.parseFindOption(findOption);
    const query = this.mongooseModel.updateOne(findQuery, updateData);
    const result = await query.exec();
    return result.modifiedCount;
  }

  async findOne(
    findOption: FindOption<DomainModel>,
    sortOption?: SortOption<DomainModel>,
  ): Promise<DomainModel | null> {
    return this.findOneWith(findOption, undefined, sortOption);
  }

  async findOneWith(
    findOption: FindOption<DomainModel>,
    populate?: (keyof DomainModel)[],
    sortOption?: SortOption<DomainModel>,
  ): Promise<DomainModel | null> {
    const findQuery: FilterQuery<ModelDocument> =
      this.parseFindOption(findOption);
    const sortQuery = this.parseSortOption(sortOption);
    const query = this.mongooseModel.findOne(findQuery);
    if (populate) query.populate(populate);
    if (sortOption) query.sort(sortQuery);
    const document: ModelDocument | null = await query.exec();
    if (document) return this.toModel(document);
    return null;
  }

  protected parseFindOption(
    findOption: FindOption<DomainModel>,
  ): FilterQuery<ModelDocument> {
    console.log("before parse findOption", findOption);
    const findQuery: FilterQuery<ModelDocument> = {};
    Object.keys(findOption).forEach((key) => {
      let query;
      let value;
      switch (Object.keys(findOption[key])[0]) {
        case "eq":
          value = findOption[key].eq;
          if (
            this.shouldConvertedToObjectIdFields.includes(
              key as keyof DomainModel,
            )
          ) {
            value =
              value instanceof Types.ObjectId
                ? value
                : new Types.ObjectId(value);
          }
          query = value;
          break;
        case "lt":
          value = findOption[key].lt;
          if (
            this.shouldConvertedToObjectIdFields.includes(
              key as keyof DomainModel,
            )
          ) {
            value =
              value instanceof Types.ObjectId
                ? value
                : new Types.ObjectId(value);
          }
          query = { $lt: value };
          break;
        case "lte":
          value = findOption[key].lte;
          if (
            this.shouldConvertedToObjectIdFields.includes(
              key as keyof DomainModel,
            )
          ) {
            value =
              value instanceof Types.ObjectId
                ? value
                : new Types.ObjectId(value);
          }
          query = { $lte: value };
          break;
        case "gt":
          value = findOption[key].gt;
          if (
            this.shouldConvertedToObjectIdFields.includes(
              key as keyof DomainModel,
            )
          ) {
            value =
              value instanceof Types.ObjectId
                ? value
                : new Types.ObjectId(value);
          }
          query = { $gt: value };
          break;
        case "gte":
          value = findOption[key].gte;
          if (
            this.shouldConvertedToObjectIdFields.includes(
              key as keyof DomainModel,
            )
          ) {
            value =
              value instanceof Types.ObjectId
                ? value
                : new Types.ObjectId(value);
          }
          query = { $gte: value };
          break;
        case "in":
          value = findOption[key].in;
          if (
            this.shouldConvertedToObjectIdFields.includes(
              key as keyof DomainModel,
            )
          ) {
            value =
              value instanceof Types.ObjectId
                ? value
                : new Types.ObjectId(value);
          }
          query = { $in: value };
          break;
        default:
          break;
      }

      if (key === this.virtualPrimaryKeyName) findQuery["_id"] = query;
      else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        findQuery[key] = query;
      }
    });
    console.log("after parse findOption", findQuery);
    return findQuery;
  }

  private parseSortOption(sortOption?: SortOption<DomainModel>) {
    if (!sortOption) return null;
    const sortQuery = {};
    Object.keys(sortOption).forEach((key) => {
      if (sortOption[key]) {
        if (key === this.virtualPrimaryKeyName)
          sortQuery["_id"] = sortOption[key];
        else sortQuery[key] = sortOption[key];
      }
    });
    return sortQuery;
  }
}
