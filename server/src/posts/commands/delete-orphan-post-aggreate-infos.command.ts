import { PostIdentifier } from "../../models/post.model";

export class DeleteOrphanPostAggreateInfosCommand {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
