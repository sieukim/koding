import { IQuery } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class SearchPostQuery implements IQuery {
  constructor(
    public readonly query: string,
    public readonly boardType: PostBoardType,
    public readonly pageSize: number,
    public readonly cursor?: string,
  ) {}
}
