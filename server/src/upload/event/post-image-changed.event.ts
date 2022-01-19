import { IEvent } from "@nestjs/cqrs";

export class PostImageChangedEvent implements IEvent {
  constructor(
    public readonly postId: string,
    public readonly prevImageUrls: string[],
    public readonly changedImageUrls: string[],
  ) {}
}
