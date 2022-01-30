import { ICommand } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class DeleteOrphanCommentsCommand implements ICommand {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
