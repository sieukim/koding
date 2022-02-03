import { PostIdentifier } from "../../models/post.model";

export class CommentDeletedEvent {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly commentId: string,
  ) {}
}
