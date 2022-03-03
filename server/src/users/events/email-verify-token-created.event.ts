import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class EmailVerifyTokenCreatedEvent implements IEvent {
  constructor(
    public readonly email: string,
    public readonly verifyToken: string,
  ) {}
}
