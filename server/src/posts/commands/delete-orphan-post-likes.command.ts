import { PostIdentifier } from "../../models/post.model";

export class DeleteOrphanPostLikesCommand {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
