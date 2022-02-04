import { IEvent } from "@nestjs/cqrs";
import { Comment } from "../../models/comment.model";

export class CommentDeletedByAdminEvent implements IEvent {
  constructor(public readonly comment: Comment) {}
}
