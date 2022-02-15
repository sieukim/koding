import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class UserFollowedEvent implements IEvent {
  constructor(
    public readonly fromNickname: string,
    public readonly toNickname: string,
  ) {}
}
