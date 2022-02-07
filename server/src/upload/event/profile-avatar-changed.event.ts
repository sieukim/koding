import { IEvent } from "@nestjs/cqrs";

export class ProfileAvatarChangedEvent implements IEvent {
  constructor(
    public readonly nickname: string,
    public readonly prevImageUrl?: string,
    public readonly changedImageUrl?: string,
  ) {}
}
