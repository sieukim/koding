import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export class IncreaseReadCountCommand implements ICommand {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
