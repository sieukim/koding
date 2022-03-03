import { ICommand } from "@nestjs/cqrs";

export class SendEmailVerifyTokenCommand implements ICommand {
  constructor(public readonly email: string) {}
}
