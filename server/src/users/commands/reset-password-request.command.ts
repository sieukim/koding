import { ICommand } from "@nestjs/cqrs";

export class ResetPasswordRequestCommand implements ICommand {
  constructor(public readonly email: string) {}
}
