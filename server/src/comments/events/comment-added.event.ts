import { IEvent } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class CommentAddedEvent implements IEvent {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly postWriterNickname: string,
    public readonly commentId: string,
    public readonly commentWriterNickname: string,
    public readonly commentContent: string,
    public readonly mentionedUserNicknames: string[],
  ) {}
}
