import { IEvent } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";
import { Event } from "../../common/utils/event";

@Event()
export class TagChangedEvent implements IEvent {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly prevTags: readonly string[],
    public readonly changedTags: readonly string[],
  ) {}
}
