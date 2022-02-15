import { IQuery } from "@nestjs/cqrs";
import { PostSortType } from "../services/post-search.service";

export class UnifiedSearchPostQuery implements IQuery {
  constructor(
    public readonly query: string | undefined,
    public readonly tags: string[] | undefined,
    public readonly sortType: PostSortType,
    public readonly postsPerBoard: number,
  ) {}
}
