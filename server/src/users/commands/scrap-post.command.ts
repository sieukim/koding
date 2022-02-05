import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class ScrapPostCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
  ) {}
}
