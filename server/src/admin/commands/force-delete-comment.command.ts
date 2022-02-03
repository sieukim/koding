import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class ForceDeleteCommentCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly commentId: string,
  ) {}
}
