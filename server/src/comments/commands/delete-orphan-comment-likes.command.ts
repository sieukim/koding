import { PostIdentifier } from "../../models/post.model";

export class DeleteOrphanCommentLikesCommand {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly commentId: string,
  ) {}
}
