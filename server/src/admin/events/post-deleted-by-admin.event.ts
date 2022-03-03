import { IEvent } from "@nestjs/cqrs";
import { Post } from "../../entities/post.entity";
import { Event } from "../../common/utils/event";

@Event()
export class PostDeletedByAdminEvent implements IEvent {
  constructor(public readonly post: Post) {}
}
