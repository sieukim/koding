import { IEvent } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";
import { Event } from "../../common/utils/event";

@Event()
export class PostReadCountIncreasedEvent implements IEvent {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
