import { ICommand } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class GetPostListQuery implements ICommand {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly pageSize: number,
    public readonly cursorPostId?: string,
    public readonly searchQuery?: { tags?: string[] },
  ) {}
}
