import { IQuery } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class ReadCommentsQuery implements IQuery {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly pageSize: number,
    public readonly cursorCommentId?: string,
    public readonly readerNickname?: string,
  ) {}
}
