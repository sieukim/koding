import { IEvent } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";
import { Event } from "../../common/utils/event";

@Event()
export class PostUnlikedEvent implements IEvent {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
    public readonly likeDate: Date,
  ) {}
}
