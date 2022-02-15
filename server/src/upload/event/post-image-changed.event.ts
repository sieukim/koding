import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class PostImageChangedEvent implements IEvent {
  constructor(
    public readonly postId: string,
    public readonly prevImageUrls: string[],
    public readonly changedImageUrls: string[],
  ) {}
}
