import { IEvent } from "@nestjs/cqrs";
import { Post } from "../../models/post.model";

export class PostDeletedByAdminEvent implements IEvent {
  constructor(public readonly post: Post) {}
}
