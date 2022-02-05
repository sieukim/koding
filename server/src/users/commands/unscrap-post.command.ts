import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class UnscrapPostCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
  ) {}
}
