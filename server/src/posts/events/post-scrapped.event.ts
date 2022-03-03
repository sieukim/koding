import { IEvent } from "@nestjs/cqrs";
import { PostIdentifier } from "../../entities/post.entity";
import { Event } from "../../common/utils/event";

@Event()
export class PostScrappedEvent implements IEvent {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
    public readonly scrapDate: Date,
  ) {}
}
