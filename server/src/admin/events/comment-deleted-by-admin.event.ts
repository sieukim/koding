import { IEvent } from "@nestjs/cqrs";
import { Comment } from "../../models/comment.model";
import { Event } from "../../common/utils/event";

@Event()
export class CommentDeletedByAdminEvent implements IEvent {
  constructor(public readonly comment: Comment) {}
}
