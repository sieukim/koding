import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class ForceDeleteCommentCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly commentId: string,
  ) {}
}
