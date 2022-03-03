import { IQuery } from "@nestjs/cqrs";
import { PostSortType } from "../services/post-search.service";
import { PostBoardType } from "../../entities/post-board.type";

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
