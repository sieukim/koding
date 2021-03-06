import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";

export enum IncreaseType {
  Positive = 1,
  Negative = -1,
}

export class IncreaseCommentCountCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly type: IncreaseType,
  ) {}
}
