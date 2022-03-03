import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class UnlikePostCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
  ) {}
}
