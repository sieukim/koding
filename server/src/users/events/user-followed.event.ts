import { IEvent } from "@nestjs/cqrs";

export class UserFollowedEvent implements IEvent {
  constructor(
    public readonly fromNickname: string,
    public readonly toNickname: string,
  ) {}
}
