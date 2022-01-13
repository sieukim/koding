import { IEvent } from "@nestjs/cqrs";

export class SendEmailCommand implements IEvent {
  constructor(
    public readonly email: string,
    public readonly title: string,
    public readonly content: string,
  ) {}
}
