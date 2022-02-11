import { IEvent } from "@nestjs/cqrs";

export class CommentLikedEvent implements IEvent {
  constructor(
    public readonly commentId: string,
    public readonly nickname: string,
    public readonly likeDate: Date,
  ) {}
}
