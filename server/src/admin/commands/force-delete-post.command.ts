import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class ForceDeletePostCommand implements ICommand {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
