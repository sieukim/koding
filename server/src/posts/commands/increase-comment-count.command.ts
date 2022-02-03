import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export enum IncreaseType {
  Positive,
  Negative,
}

export class IncreaseCommentCountCommand implements ICommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly type: IncreaseType,
  ) {}
}
