import { PostIdentifier } from "../../models/post.model";

export class DeleteOrphanPostScrapsCommand {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
