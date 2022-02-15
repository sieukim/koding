import { IEvent } from "@nestjs/cqrs";
import { Event } from "../../common/utils/event";

@Event()
export class EmailUserSignedUpEvent implements IEvent {
  constructor(
    public readonly email: string,
    public readonly nickname: string,
    public readonly verifyToken: string,
  ) {}
}
