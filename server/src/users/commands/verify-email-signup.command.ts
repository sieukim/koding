import { ICommand } from "@nestjs/cqrs";

export class VerifyEmailSignupCommand implements ICommand {
  constructor(
    public readonly nickname: string,
    public readonly verifyToken: string,
  ) {}
}
