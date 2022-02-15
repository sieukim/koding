import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class UserDeletedEvent implements IEvent {
  constructor(public readonly nickname: string) {}
}
