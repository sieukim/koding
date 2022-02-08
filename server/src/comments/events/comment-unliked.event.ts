import { IEvent } from "@nestjs/cqrs";

export class CommentUnlikedEvent implements IEvent {
  constructor(
    public readonly commentId: string,
    public readonly nickname: string,
    public readonly likeDate: Date,
  ) {}
}
