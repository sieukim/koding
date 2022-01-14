import { IEvent } from "@nestjs/cqrs";

export class ResetPasswordRequestedEvent implements IEvent {
  constructor(
    public readonly email: string,
    public readonly nickname: string,
    public readonly verifyToken: string,
  ) {}
}
