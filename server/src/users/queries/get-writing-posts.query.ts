import { IQuery } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class GetWritingPostsQuery implements IQuery {
  constructor(
    public readonly nickname: string,
    public readonly boardType: PostBoardType,
    public readonly pageSize: number,
    public readonly cursor?: string,
  ) {}
}
