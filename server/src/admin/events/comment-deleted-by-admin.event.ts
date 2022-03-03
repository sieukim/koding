import { IEvent } from "@nestjs/cqrs";
import { Comment } from "../../entities/comment.entity";
import { Event } from "../../common/utils/event";

@Event()
export class CommentDeletedByAdminEvent implements IEvent {
  constructor(public readonly comment: Comment) {}
}
