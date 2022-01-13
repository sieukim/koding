import { FindOption } from "./find-option";
import { Document, FilterQuery, Model, Types } from "mongoose";
import { SortOption } from "./sort-option";

export abstract class MongooseBaseRepository<
  DomainModel,
  ModelDocument extends Document,
> {
  protected constructor(
    private readonly toModel: (document: ModelDocument) => DomainModel,
    private readonly fromModel: (
      model: DomainModel,
      mongooseModel: Model<ModelDocument>,
    ) => ModelDocument,
    private readonly mongooseModel: Model<ModelDocument>,
    private readonly shouldConvertedToObjectIdFields: (keyof DomainModel)[] = [],
    private readonly virtualPrimaryKeyName?: keyof ModelDocument,
  ) {}

  abstract persist(model: DomainModel): Promise<DomainModel>;

  abstract update(model: DomainModel): Promise<DomainModel>;

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
    let query = this.mongooseModel.findOne(findQuery);
    if (populate) query = query.populate(populate);
    if (sortOption) query = query.sort(sortQuery);
    const document: ModelDocument | null = await query.exec();
    console.log("document: ", document);
    if (document) return this.toModel(document);
    return null;
  }

  private parseFindOption(
    findOption: FindOption<DomainModel>,
  ): FilterQuery<ModelDocument> {
    const findQuery: FilterQuery<ModelDocument> = {};
    Object.keys(findOption).forEach((key) => {
      let query;
      switch (Object.keys(findOption[key])[0]) {
        case "eq":
          query = findOption[key].eq;
          break;
        case "lt":
          query = { $lt: findOption[key].lt };
          break;
        case "lte":
          query = { $lte: findOption[key].lte };
          break;
        case "gt":
          query = { $gt: findOption[key].gt };
          break;
        case "gte":
          query = { $gte: findOption[key].gte };
          break;
        case "in":
          query = { $in: findOption[key].in };
          break;
        default:
          break;
      }
      if (
        this.shouldConvertedToObjectIdFields.includes(key as keyof DomainModel)
      )
        query =
          query instanceof Types.ObjectId ? query : new Types.ObjectId(query);

      if (key === this.virtualPrimaryKeyName) findQuery["_id"] = query;
      else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        findQuery[key] = query;
      }
    });
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
