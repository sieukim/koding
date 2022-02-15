import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class CommentLikedEvent implements IEvent {
  constructor(
    public readonly commentId: string,
    public readonly nickname: string,
    public readonly likeDate: Date,
  ) {}
}
