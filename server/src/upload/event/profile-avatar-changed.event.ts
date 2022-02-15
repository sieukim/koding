import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class ProfileAvatarChangedEvent implements IEvent {
  constructor(
    public readonly nickname: string,
    public readonly prevImageUrl?: string,
    public readonly changedImageUrl?: string,
  ) {}
}
