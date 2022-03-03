import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class UnscrapPostCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
  ) {}
}
