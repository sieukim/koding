import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";
import { PostBoardType } from "../../entities/post-board.type";

@Event()
export class TagChangedEvent implements IEvent {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly prevTags: readonly string[],
    public readonly changedTags: readonly string[],
  ) {}
}
