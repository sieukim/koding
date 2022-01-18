import { IEvent } from "@nestjs/cqrs";
import { PostBoardType } from "../../models/post.model";

export class TagChangedEvent implements IEvent {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly prevTags: readonly string[],
    public readonly changedTags: readonly string[],
  ) {}
}
