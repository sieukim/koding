import { IEvent } from "@nestjs/cqrs";
import { Post } from "../../models/post.model";
import { Event } from "../../common/utils/event";

@Event()
export class PostDeletedByAdminEvent implements IEvent {
  constructor(public readonly post: Post) {}
}
