import { IEvent } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class PostReadCountIncreasedEvent implements IEvent {
  constructor(public readonly postIdentifier: PostIdentifier) {}
}
