import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class DeleteCommentCommand implements ICommand {
  constructor(
    public readonly requestUserNickname: string,
    public readonly postIdentifier: PostIdentifier,
    public readonly commentId: string,
  ) {}
}
