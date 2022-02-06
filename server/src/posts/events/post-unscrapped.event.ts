import { IEvent } from "@nestjs/cqrs";
import { PostIdentifier } from "../../models/post.model";

export class PostUnscrappedEvent implements IEvent {
  constructor(
    public readonly postIdentifier: PostIdentifier,
    public readonly nickname: string,
    public readonly scrapDate: Date,
  ) {}
}
