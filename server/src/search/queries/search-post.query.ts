import { IQuery } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";
import { PostSortType } from "../services/post-search.service";

export class SearchPostQuery implements IQuery {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly query: string | undefined,
    public readonly tags: string[] | undefined,
    public readonly sortType: PostSortType,
    public readonly pageSize: number,
    public readonly cursor?: string,
  ) {}
}
