import { PostIdentifier } from "../../models/post.model";
import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class CommentDeletedEvent implements IEvent {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly commentId: string,
    public readonly commentCreatedAt: Date,
  ) {}
}
