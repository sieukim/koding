import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class SyncPostTitleOfCommentCommand implements ICommand {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
